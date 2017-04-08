#include <string.h>
#include "cdn.h"

void deploy_server(char * topo[MAX_EDGE_NUM], int line_num, char * filename)
{
    //构建一个稀疏图对象
    SparseGraph g;     
    //读取txt中数据并一一赋值给g对象
    ReadGraph(g,topo); 
    //启发式搜索
    simulatedAnneal(g); 
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

