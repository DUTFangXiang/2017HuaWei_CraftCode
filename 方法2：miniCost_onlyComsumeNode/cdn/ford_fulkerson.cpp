#include"cdn.h"

/*
@构建最小费用最大流模型的有参构造函数
@入参：graph构建的图模型，s是布置的服务器，t是消费节点，require是消费节点需求流量
@返回值：无
修改时间：2017-3-21
*/
ford_fulkerson::ford_fulkerson(SparseGraph &graph, int s, int t, int require) 
    :G(graph)
{
    this->souce = s;
    this->aim = t;
    sumcost = 0;
    maxstream = 0;
    distTo = new int[G.V()];
    marked = new bool[G.V()];
    if (require != 0)
    {
	for (int i = 0; i < G.V(); i++)
	    from.push_back(NULL);
	reachrequest = false;

	SPFA(s,t);
	int min_rem_f;//记录增广路径中的残留容量
	while (from[t] != NULL)
        {
	    min_rem_f = MAXVALUE;
 	    Edge* e = from[t];
 	    while (e != NULL)//找经过的边最小的可提供带宽
	    {
		if (min_rem_f > e->rem_f)
		    min_rem_f = e->rem_f;
		e = from[e->v()];
	    }
	    if (maxstream + min_rem_f >= require)
	    {
	  	min_rem_f = require - maxstream;
		maxstream = require;
		reachrequest = true;
	    }
	    else
		maxstream += min_rem_f;
	    e = from[t];//计算增广路径上的残留容量
	    while (e != NULL)
	    {
		sumcost += e->cur_cost * min_rem_f;//更新sumcost
		e->rem_f -= min_rem_f;
		if (e->rem_f == 0 && e->cur_cost < 0)
  		{
		    e->rem_f = e->bw();
		    e->cur_cost = e->cost();
		}
		SparseGraph::adjIterator adj(G, e->w());
		    for (Edge* e2 = adj.begin(); !adj.end(); e2 = adj.next())
		    {
	       		if (e2->w() == e->v())
			{
			    if (e2->rem_f == e2->bw())
			    {
				e2->rem_f = e2->bw() - e->rem_f;
				e2->cur_cost = -e2->cost();
			    }
			    else
				e2->rem_f += min_rem_f;
			    break;
			}
		    }
		    e = from[e->v()];
		}
	        if (reachrequest)
		    break;
		SPFA(s,t);
	    }
    }		
}

/*
@构建最小费用最大流模型的析构函数
@入参：  无
@返回值：无
修改时间：2017-3-21
*/
ford_fulkerson::~ford_fulkerson()
{
    delete[] distTo;
    delete[] marked;
}

/*
@求最短路径的SPFA算法 
@入参：  无
@返回值：无
修改时间：2017-3-22
*/
void ford_fulkerson::SPFA(int s,int t)
{ 
    for (int i = 0; i < G.V(); i++)
    {
	distTo[i] = MAXVALUE;
	marked[i] = false;
	from[i]   = NULL;
    }
    distTo[s] = 0;
    queue<int> empty;
    swap(Q,empty);
    Q.push(s);
    marked[s] = true;
    while (!Q.empty())
    {
	int v = Q.front();
	if(distTo[t] <=0)
	    break;
	Q.pop();
	marked[v] = false;
	SparseGraph::adjIterator adj(G, v);
        //更新u的邻接点的distTo[], from[], marked[]
	for (Edge* e = adj.begin(); !adj.end(); e = adj.next())
        {
	    int w = e->other(v);
            // 表示(u,v)没有边
	    if (e->rem_f == 0)       
		continue;
            //松弛操作
	    if (distTo[w] > distTo[v] + e->cur_cost)  
	    {
	    	distTo[w] = distTo[v] + e->cur_cost;
		from[w] = e;
		//此处可用堆优化
		if (marked[w] == false)
		{
		    Q.push(w);
		    marked[w] = true;
		}
	     }	   
	}
     }
}

