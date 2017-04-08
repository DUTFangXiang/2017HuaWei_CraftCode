#ifndef __FORD_FULKERSON_H__
#define __FORD_FULKERSON_H__

#include <vector>
#include <queue>
#include "edge.h"

using namespace std;

class ford_fulkerson
{
private:
    SparseGraph &G;
    int souce;    //源点
    int aim;      //终点
    int sumcost;  //最小费用
    int maxstream;//最大流
    int *distTo;  //最小cost
    bool *marked; //是否被标记为已选中的节点
    vector<Edge*> from;//存储上一节点位置
    queue<int> Q;
    bool reachrequest;
public:
    ford_fulkerson(SparseGraph &graph, int s, int t, int require);
    ~ford_fulkerson();
    void SPFA(int s,int t);//求最短路径的SPFA算法  
    int maxStream(){
	return maxstream;
    }
    int sumCost(){
	return sumcost;
    }	
    bool reachOK(){
	return reachrequest;
    }				
};


#endif
