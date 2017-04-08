/*****************
FX 2017.3.26  ����ʱ��Ĳ���

�ڼ��㵱ǰ����������С���������֮ǰ�����Ѽ���Ϊ0
sumCur = minCostMaxFlow(gh, existNode);
��֮�����¼����ļ�����Ҳ����������ʱ��
ReadGraph(gh, "case6.txt");
Ŀǰ��ʼ�������ű���1000��
********************/
#include<list>
#include<set>
#include<iterator>
#include"cdn.h"

using namespace std;

/*
@����m-n�������
*/
int random(int m, int n){
    double x = (double)rand() / RAND_MAX;
    int a = (int)(x*(n - m) + 0.5) + m;
    return a;
}
/*
@����һ�������������ڵ�Ҫ���ڵ�ǰ������Ⱥ����
*/
void addOneServer(set<int> &existNode, set<int> &notWantedNode){
	set<int>::iterator iter = notWantedNode.begin();
	int i = 0;
	//�������һ������ڵ�
	int randNum = random(0, notWantedNode.size() - 1);
	//��������Ҫ���Ǹ���
	while ((i < randNum) && (iter != notWantedNode.end())){
	    ++iter;
	    ++i;
	}
	//���õ���ֵ�ӵ�������Ⱥ����
	existNode.insert(*iter);
}
/*
@��ȥ������Ⱥ����һ���ڵ�
*/
void reduceOneServer(set<int> &existNode){
	set<int>::iterator iter = existNode.begin();
	int i = 0;
	//�������һ������ڵ�
	int randNum = random(0, existNode.size() - 1);
	while ((i < randNum) && (iter != existNode.end()))
	{
	    ++iter;
	    ++i;
	}
	//ɾ���ýڵ�  	advance(iter,randNum);//������ǰ��random��λ��	
	existNode.erase(iter);
}
/*
@���ҳ�������������ڵ�
*/
void getRemainNode(int networkNodeNum, set<int> &existNode, set<int> &notWantedNode){
    bool isExist;
    notWantedNode.clear();  //���֮ǰ�ķ�����
    for (int i = 0; i < networkNodeNum; i++){
	isExist = false;
	for (set<int>::iterator iter = existNode.begin(); iter != existNode.end(); iter++){
	    if (i == *iter){
		isExist = true;
		break;
	    }
	}
	if (!isExist)
	    notWantedNode.insert(i);
    }
}
/*
@ ģ���˻��㷨����
@ gh������ͼģ�ͣ�tģ���˻�ĳ�ʼ�¶ȣ�
@ at�˻�����ʣ�N ��С�ɽ��ܷ���������
*/
void simulatedAnneal(SparseGraph &gh, double t, float RANDX, float RANDY)
{
    double totalTime;
    float randX;
    long sumCur;            //��ǰ������ܼ۸�
    int  consumeNodeNum = gh.consumeNodeNum;
    //int  count = 0;         //�������
    set<int> existNode;    //��ǰѡ��ķ�����
    set<int> notWantedNode;//��������֮����������ڵ�
    set<int> copyExistNode;//������ǰ���������˻�ʧ�ܷ�����һ�η�����״̬
    //��ʼ�����������������ѽڵ������ӵ�����ڵ�
    for (int i = 0; i < consumeNodeNum; i++)
	existNode.insert(gh.f[i].linkedNodeID);
    //��ʼ������ܼ۸񣬷��������������ѽڵ������ӵĵط�
    long sumPre = consumeNodeNum*gh.serverCost;
    //��������ڵ����
    int networkNodeNum = gh.networkNodeNum-2;
    srand((unsigned)time(NULL));
    while (1)
    {	
	//���ӻ��Ǽ���ǰ�ȱ�����ǰ�ڵ㣬��ֹ���ǳ��˻��������
	copyExistNode = existNode;  
	//����������Ƿ��׿�ԭ����, ��������µķ���
	randX = (float)rand() / RAND_MAX;
	if(randX <= RANDX) //�滻����һ���������ڵ�  else 
	{
	    reduceOneServer(existNode);
	    getRemainNode(networkNodeNum, existNode, notWantedNode);	 
	    addOneServer(existNode, notWantedNode);
	}
	else if(randX <= RANDY)  //���������������һ�����������Ǽ���һ��
	{
	    getRemainNode(networkNodeNum, existNode, notWantedNode);
	    addOneServer(existNode, notWantedNode);
	 }
	 else 
	    reduceOneServer(existNode);	
	for (set<int>::iterator it = existNode.begin(); it != existNode.end();it++)
	{
	    gh.g[gh.V() - 1].push_back(new Edge(gh.V()-1, *it, MAXVALUE, 0));
	}
	sumCur = minCostMaxFlow(gh, existNode);
	if ((sumCur - sumPre) < 0)
	{
	    sumPre = sumCur;          //������С���
	    gh.serverRel.clear();
	    gh.serverRel = existNode; //���ܵ�ǰ���������ֽ��
	    //Ϊ�˱��ⷴ������g��ͣ�������������ݣ���Ҫ���
	    for (size_t i = 0; i < gh.gRel.size(); i++)
	        gh.gRel[i].clear();
	    for (size_t i = 0; i < networkNodeNum; i++)
    	    {
	      for (size_t j = 0; j < gh.g[i].size(); j++)
	          gh.gRel[i].push_back({gh.g[i][j]->w(),gh.g[i][j]->rem_f,gh.g[i][j]->cur_cost});
            }
	}
	else 
	    existNode = copyExistNode; //�������ܷ�����һ�η���������״̬
        //��ʱ�ı���������ѭ����ѯ�˶��ٴ�
	//count++;
	//ʱ�����90sҲֹͣ
	totalTime = ((double)(clock() - start) / CLOCKS_PER_SEC);
	if (totalTime > t)
	    break;
        //�ָ�ͼ�ṹ��������
	gh.recover();
    }
   printf("\ntime: %lf\n",totalTime);
   printf("\niteration time: %d\n",count);
   printf("\ntotal cost: %ld\n",sumPre);
}

