#ifndef __CDN_H__
#define __CDN_H__

#include <cassert>
#include <list>
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
#include "edge.h"
#include "graph.h"
#include "lib_io.h"
#include "ford_fulkerson.h"
#include "minCostMaxFlow.h"
#include "simulatedAnneal.h"

//程序计时开始的时刻，定义在cdn.cpp中
extern clock_t start;    
//处理数据和算法核心
void deploy_server(char * graph[MAX_EDGE_NUM], int edge_num, char * filename); 
//解析输入样本文件的每行数据 readGraph.cpp
void ReadGraph(SparseGraph &graph, char * line[MAX_EDGE_NUM]);

#endif
