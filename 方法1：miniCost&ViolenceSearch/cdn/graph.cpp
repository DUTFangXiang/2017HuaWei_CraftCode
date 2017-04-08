 #include"cdn.h"

/*
@SparseGraph构造函数
@入参：void
@返回值：void
修改时间：2017-3-21
*/
SparseGraph::SparseGraph()
{
    networkNodeNum = 0;
    networkPathNum = 0;
    consumeNodeNum = 0;
    serverCost = 0;
    totalRequire = 0;
}

/*
@SparseGraph析构函数
@入参：void
@返回值：void
修改时间：2017-3-21
*/
SparseGraph::~SparseGraph()
{
    for (int i = 0; i < networkNodeNum; i++)
    {
	for (int j = 0; j < g[i].size(); j++)
	    delete g[i][j];
    }
}

/*
@查找网络节点连接对应的消费节点
@入参：a网络节点
@返回值：i消费节点，如果没有连接返回数值为-1
修改时间：2017-3-21
*/
void SparseGraph::recover()
{
    for (int i = 0; i < networkNodeNum-2; i++)
    {
	for (int j = 0; j < g[i].size(); j++)
	{
	    g[i][j]->rem_f = g[i][j]->bw();             //剩余带宽
	    g[i][j]->cur_cost = g[i][j]->cost();        //当前路径花费;
	}
    }
    //清空超级点
    g[networkNodeNum-1].clear();
    totalRequire = copy_totalRequire;
}

/*
@初始化图，初始化路径相连信息
@入参：n网络路径数量
@返回值：void
修改时间：2017-3-21
*/
void SparseGraph::initGraph(int n)
{
    for (int i = 0; i < n; i++)
	g.push_back(vector<Edge* >());
    for(int i=0;i<n-2;i++)
	gRel.push_back(vector<Rel>());
}

/*
@初始化图，初始化路径相连信息
@入参：v链路起点ID w终点ID bw总带宽大小 cost单位网络租用费
@返回值：void
修改时间：2017-3-21
*/
void SparseGraph::addEdge(int v, int w, int bw,int cost)
{
    g[v].push_back(new Edge(v, w, bw, cost));
    g[w].push_back(new Edge(w, v, bw, cost));
}

/*
@添加消费节点
@入参：a消费节点ID b相连网络节点ID c视频带宽消耗需求
@返回值：void
修改时间：2017-3-21
*/
void SparseGraph::addConsumeNode(int a, int b, int c)
{
    f.push_back({a, b, c, c});
}

/*
@查找网络节点连接对应的消费节点
@入参：a网络节点
@返回值：i消费节点，如果没有连接返回数值为-1
修改时间：2017-3-21
*/
int SparseGraph::networkToconsume(int a)
{
    for (int i = 0; i < consumeNodeNum; i++)
    {
        if (f[i].linkedNodeID == a)
	    return i;
    }
    return -1;
}

/*
@保存被使用的路径，带宽
@入参：void
@返回值：void
修改时间：2017-3-22
*/
void SparseGraph::saveUsedpath( ){
    for (int i = 0; i < consumeNodeNum; i++){
	bool flag = true;
	int  netNode = f[i].linkedNodeID;
	int  numServer = serverRel.size();
	int min_ref = MAXVALUE;
	vector<int> tmp;
	for (set<int>::iterator iter = serverRel.begin(); iter != serverRel.end(); iter++){
	    if (netNode == *iter){
		flag = false;
		tmp.push_back(netNode);
		tmp.push_back(i);
		tmp.push_back(f[i].copy_requireCost);
		path.push_back(tmp);
		pathCount++;
		break;
	    }
	}
	while (flag){
	    tmp.clear();
	    min_ref = MAXVALUE;
	    flag = false;
	    for (int j = 0; j < gRel[netNode].size(); j++){
		if (gRel[netNode][j].rem_f != 0 && gRel[netNode][j].cur_cost < 0){
		    flag = true;
		    min_ref = gRel[netNode][j].rem_f > min_ref ? min_ref : gRel[netNode][j].rem_f;
		    dfs(gRel[netNode][j].endNode, min_ref, tmp);
		    gRel[netNode][j].rem_f -= min_ref;
		    break;
		} 
	    }
	    if (flag){
		tmp.push_back(netNode);
		tmp.push_back(i);
		tmp.push_back(min_ref);
		path.push_back(tmp);
		pathCount++;
	    }
	}
    }
}

/*
@深度优先搜索
@入参：void
@返回值：void
修改时间：2017-3-22
*/	
void SparseGraph::dfs(int v, int &min_ref, vector<int> &tmp){
    for (int j = 0; j < gRel[v].size(); j++){
	if (gRel[v][j].rem_f != 0 && gRel[v][j].cur_cost < 0){
	    min_ref = gRel[v][j].rem_f > min_ref ? min_ref : gRel[v][j].rem_f;
	    dfs(gRel[v][j].endNode, min_ref, tmp);
	    gRel[v][j].rem_f -= min_ref;
	    break;
	}
    }
    tmp.push_back(v);
}


