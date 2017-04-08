#ifndef __SIMULATEDANNEAL_H__
#define __SIMULATEDANNEAL_H__

#include <set>  
#include "graph.h"


using namespace std;

#define E   2.2250738585072014e-308  // �������     

void simulatedAnneal(SparseGraph &gh);  //����ģ���˻��㷨������·��   
int random(int m, int n);
void addOneServer(set<int> &existNode, set<int> &notWantedNode);//�������һ��������
void reduceOneServer(set<int> &existNode);   //�������һ��������

#endif
