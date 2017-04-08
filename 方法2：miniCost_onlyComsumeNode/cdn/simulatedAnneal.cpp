/*****************
FX 2017.3.26  花费时间的测量

在计算当前服务器的最小费用最大流之前，花费几乎为0
sumCur = minCostMaxFlow(gh, existNode);
在之后，重新加载文件数据也几乎不花费时间
ReadGraph(gh, "case6.txt");
目前起始三个点大概遍历1000次
********************/
#include<list>
#include<set>
#include<iterator>
#include"cdn.h"

using namespace std;

/*
@产生m-n的随机数
*/
int random(int m, int n){
    double x = (double)rand() / RAND_MAX;
    int a = (int)(x*(n - m) + 0.5) + m;
    return a;
}
/*
@增加一个服务器，但节点要求不在当前服务器群组中
*/
void addOneServer(set<int> &existNode, set<int> &notWantedNode){
	set<int>::iterator iter = notWantedNode.begin();
	int i = 0;
	//随机创建一个网络节点
	int randNum = random(0, notWantedNode.size() - 1);
	//遍历到想要的那个点
	while ((i < randNum) && (iter != notWantedNode.end())){
	    ++iter;
	    ++i;
	}
	//将该点数值加到服务器群组中
	existNode.insert(*iter);
}
/*
@减去服务器群组中一个节点
*/
void reduceOneServer(set<int> &existNode){
	set<int>::iterator iter = existNode.begin();
	int i = 0;
	//随机创建一个网络节点
	int randNum = random(0, existNode.size() - 1);
	while ((i < randNum) && (iter != existNode.end()))
	{
	    ++iter;
	    ++i;
	}
	//删除该节点  
	existNode.erase(iter);
}
/*
@查找出除服务器网络节点
*/
void getRemainNode(vector<ConsumeNode> f, set<int> &existNode, set<int> &notWantedNode){
    bool isExist;
    notWantedNode.clear();  //清除之前的服务器
    for (size_t i = 0; i < f.size(); i++){
	isExist = false;
	for (set<int>::iterator iter = existNode.begin(); iter != existNode.end(); iter++){
	    if (f[i].linkedNodeID == *iter){
		isExist = true;
		break;
	    }
	}
	if (!isExist)
	    notWantedNode.insert(f[i].linkedNodeID);
    }
}
/*
@ 模拟退火算法核心
@ gh构建的图模型，t模拟退火的初始温度，
@ at退火的速率，N 最小可接受服务器个数
*/
void simulatedAnneal(SparseGraph &gh)
{
    double totalTime;
    float  randX;
    long   sumCur;         //当前计算的总价格
    int    count;
    int    consumeNodeNum = gh.consumeNodeNum;
    set<int> existNode;    //当前选择的服务器
    set<int> notWantedNode;//除服务器之外其他网络节点
    set<int> copyExistNode;//拷贝当前服务器，退火失败返回上一次服务器状态
    //初始服务器布置在与消费节点相连接的网络节点
    for (int i = 0; i < consumeNodeNum; i++)
	existNode.insert(gh.f[i].linkedNodeID);
    //初始计算的总价格，服务器布置与消费节点相连接的地方
    long sumPre = consumeNodeNum*gh.serverCost;
    //真正网络节点个数
    int networkNodeNum = gh.networkNodeNum-2;
    while (1)
    {	
	//增加还是减少前先保留当前节点，防止不是朝退火方向而返回
	copyExistNode = existNode;  
	
	randX = (float)rand() / RAND_MAX;
	//随机减一个服务器节点
	if(randX <= 0.4)  
	    reduceOneServer(existNode);	
	//替换一个服务器节点
	else                
	{
	    reduceOneServer(existNode);
	    getRemainNode(gh.f, existNode, notWantedNode);	 
	    addOneServer(existNode, notWantedNode);
	}
	for (set<int>::iterator it = existNode.begin(); it != existNode.end();it++)
	{
	    gh.g[gh.V() - 1].push_back(new Edge(gh.V()-1, *it, MAXVALUE, 0));
	}
	//最小费用流
	sumCur = minCostMaxFlow(gh, existNode);
	//接受当前结果
	if (sumCur - sumPre < 0)
	{

	    sumPre = sumCur;          //更新最小结果
printf("totalTime:%f,sumPre:%d\n",totalTime,sumPre);
	    gh.serverRel.clear();
	    gh.serverRel = existNode; //接受当前服务器布局结果
	    //为了避免反复读入g不停的往后增加数据，先要清空
	    for (size_t i = 0; i < gh.gRel.size(); i++)
	        gh.gRel[i].clear();
	    for (size_t i = 0; i < networkNodeNum; i++)
    	    {
	      for (size_t j = 0; j < gh.g[i].size(); j++)
	          gh.gRel[i].push_back({gh.g[i][j]->w(),gh.g[i][j]->rem_f,gh.g[i][j]->cur_cost});
            }
	}
	//不接受结果
	else 
	    existNode = copyExistNode; //若不接受返回上一次服务器布局状态
	count++;
	//时间大于90s也停止
	totalTime = ((double)(clock() - start) / CLOCKS_PER_SEC);
	if (totalTime > 89)
	    break;
        //恢复图结构重新搜索
	gh.recover();
    }
    printf("\ntime: %lf\n",totalTime);
    printf("\niteration time: %d\n",count);
    printf("\ntotal cost: %ld\n",sumPre);
}

