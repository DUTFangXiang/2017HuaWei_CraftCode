#ifndef __GRAPH_H__
#define __GRAPH_H__

#include <iostream>
#include <vector>
#include <set>
#include <cassert>

using namespace std;

#define MAXNUM     10     //数据组成最大包含的字符数
#define MAXPATH    5000   //网络链路总数的最大值
#define MAXCONSUME 500   //消费者节点个数最大值
#define MAXVALUE   10e3   //节点之间断开的情况下设置的最大距离
#define MAXTIME    85     //最大时间 s
#define MAXV       1000   //链路节点个数的最大值
#define MAXCOST    1000000//定义一个最大总花费，模拟不能实现的情况

struct ConsumeNode
{
    int consumeNodeID;//消费节点ID
    int linkedNodeID;//与消费者节点相连接的网络节点
    int requireCost;//每个消费节点消耗需求
    int copy_requireCost;
};
struct Rel
{
    int endNode;
    int rem_f;    
    int cur_cost;     
};

/*******稀疏图 - 邻接表*********/
class SparseGraph
{
public:
    //存储图信息的属性变量
    int serverCost;          //每台服务器花费金额
    int networkNodeNum;      //网络节点数量  
    int networkPathNum;      //网络链路数量
    int consumeNodeNum;      //消费节点数量
    size_t maxLinkedNode;       //链路最多的节点
    long totalRequire;        //总带宽
    long copy_totalRequire;   
    vector<vector<Edge *>> g;//网络路径邻接表
    vector<ConsumeNode>  f;  //消费节点与相连网络节点表
    //保存最后结果的属性
    int pathCount;              //输出的网络路径条数
    set<int> serverRel;        //服务器布局结果
    vector<vector<Rel>> gRel;//网络路径邻接表
    vector<vector<int>> path;   //最终路径结果
    //实现的函数方法
    SparseGraph();           //构造函数    
    ~SparseGraph();          //析构函数
    void GetmaxLinkedNode();    //求出度最多的节点
    void recover();          //恢复图
    void initGraph(int n);   //初始化图
    void addEdge(int v, int w, int bw,int cost);//添加网络链路
    void addConsumeNode(int a, int b, int c);   //添加消费节点	
    int  networkToconsume(int a);   //网络节点对应连接的消费节点		
    void dfs(int v, int &min_ref, vector<int> &tmp);
    void saveUsedpath();   //保存最终用户到服务器的路径信息
    int V(){                    //返回网络节点数量 
	return networkNodeNum; 
    } 
    int E(){                    //返回网络链路数量
        return networkPathNum; 
    }
    int X(){ 		        //返回消费节点数量
	return consumeNodeNum; 
    }
    int consumeTonetwork(int a){//消费节点转网络节点
	return f[a].linkedNodeID;
    }
    int consumeRequire(int a){  //返回消费节点需要的流量
	return f[a].requireCost;
    }
    //迭代器
    class adjIterator
    {
        private:
            SparseGraph &G;
            int v;
            int index;
        public:
            adjIterator(SparseGraph &graph, int v): G(graph)
            {
                this->v = v;
                this->index = 0;
            }

	    Edge* begin()
            {
                index = 0;
                if( G.g[v].size() )
                   return G.g[v][index];
                return NULL;
            }
 
            Edge* next()
            {
                index += 1;
                if( index < G.g[v].size() )
                    return G.g[v][index];
                return NULL;
            }

            bool end()
            {
                return index >= G.g[v].size();
            }
    };

};

#endif


