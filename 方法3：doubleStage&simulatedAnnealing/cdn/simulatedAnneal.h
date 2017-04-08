#ifndef __SIMULATEDANNEAL_H__
#define __SIMULATEDANNEAL_H__

#include <set>  
#include "graph.h"


using namespace std;   

void simulatedAnneal(SparseGraph &gh, int time1, int time2, float RANDX, float RANDY, float RANDZ, float at); //启发式路径搜索   
int  random(int m, int n);
void addOneServer(set<int> &existNode, set<int> &notWantedNode);//随机增加一个服务器
void addOneServer(set<int> &existNode,set<int> &notWantedNode,float* weight);
void reduceOneServer(set<int> &existNode);   //随机减少一个服务器
void reduceOneServer(set<int> &existNode,float* weight);
void getRemainNode(vector<ConsumeNode> f, set<int> &existNode, set<int> &notWantedNode); //获取剩下服务器
void getRemainNode(int networkNodeNum, set<int> &existNode, set<int> &notWantedNode);

#endif
