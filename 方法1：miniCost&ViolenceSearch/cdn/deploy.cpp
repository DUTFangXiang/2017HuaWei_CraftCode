#include <string.h>
#include "cdn.h"

void deploy_server(char * topo[MAX_EDGE_NUM], int line_num, char * filename)
{
    SparseGraph g;     //构建一个稀疏图对象
    ReadGraph(g,topo); //读取txt中数据并一一赋值给g对象
    double t;          //控制时间
    float  RANDX, RANDY;
    //选取服务器，计算最小费用最大流
    if(g.networkNodeNum<200)
    {
	t     = 89;  
	RANDX = 0.5;
	RANDY = 0.63; 
    }
    else if(g.networkNodeNum<500)
    {
	t     = 89.3;
	RANDX = 0.45;
	RANDY = 0.5; 
    }
    else
    {
	t     = 89.4;
	RANDX = 0.4;
	RANDY = 0.7; 
    }
    simulatedAnneal(g, t, RANDX, RANDY); 
    //保存结果
    g.saveUsedpath( );
    //将结果写入保存输出变量里面
    char topo_file[100000];
    sprintf(topo_file, "%d\n\n", g.pathCount);
    for (int i = 0; i < g.pathCount; i++){
	for (int j = 0; j < g.path[i].size(); j++){
	    char str[5];
	    sprintf(str, "%d ", g.path[i][j]);
	    strcat(topo_file, str);
	}
	strcat(topo_file, "\n");
    }
    write_result(topo_file, filename);
}

