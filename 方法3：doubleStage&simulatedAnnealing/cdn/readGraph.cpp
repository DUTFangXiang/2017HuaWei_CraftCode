#include <iostream>
#include <cstdio>
#include "cdn.h"

using namespace std;

/*
@解析输入样本文件的每行数据
@入参：  graph稀疏图 topo读入的数据
@返回值：void
修改时间：2017-3-21
*/
void ReadGraph(SparseGraph &graph, char * line[MAX_EDGE_NUM])
{
    //提取网络节点数量 网络链路数量 消费节点数量
    sscanf(line[0],"%d %d %d",&graph.networkNodeNum, &graph.networkPathNum, &graph.consumeNodeNum);
    graph.networkNodeNum += 2;
    //提取视频内容服务器部署成本
    sscanf(line[2],"%d",&graph.serverCost);
    //提取链路起点ID 终点ID 总带宽大小 单位网络租用费
    int startNode, endNode;
    int bandWidth, unitPathCost;
    //for (int i = 0; i < graph.g.size(); i++) //为了避免反复读入g不停的往后增加数据，先要清空
	//graph.g[i].clear();
    //图初始化
    graph.initGraph(graph.networkNodeNum);
    for(int i=0;i<graph.networkPathNum;i++)
    {      
	sscanf(line[i+4],"%d %d %d %d",&startNode,&endNode,&bandWidth,&unitPathCost);
        graph.addEdge(startNode, endNode, bandWidth, unitPathCost);
    }
    //提取消费节点ID 相连网络节点ID 视频带宽消耗需求
    int temp = graph.networkPathNum + 5;
    int consumeNodeID, linkedNodeID, requireCost;		
    //graph.f.clear();		            //为了避免反复读入f不停的往后增加数据，先要清空
    //graph.totalRequire = 0;
    for(int i=0;i<graph.consumeNodeNum;i++)
    {
        sscanf(line[i+temp],"%d %d %d",&consumeNodeID,&linkedNodeID,&requireCost);
        graph.addConsumeNode(consumeNodeID, linkedNodeID, requireCost);  
        graph.g[linkedNodeID].push_back(new Edge(linkedNodeID, graph.networkNodeNum-2, requireCost, 0));
	graph.totalRequire += requireCost;
    }
    graph.copy_totalRequire = graph.totalRequire;
 }

