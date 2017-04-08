#ifndef __EDGE_H__
#define __EDGE_H__

class Edge
{
private:
    int startNode, endNode;//每条路径的起始节点和结束节点
    int bandWidth;         //每条线路的带宽
    int unitPathCost;      //单位网络租用费	
public:	
    int rem_f;             //剩余带宽
    int cur_cost;          //当前路径花费
    //构造函数
    Edge(int a, int b,int bw, int cost);
    
    int v(){ 
	return startNode; 
    }
    int w(){ 
	return endNode; 
    }
    int bw(){ 
	return bandWidth; 
    }
    int cost(){ 
	return unitPathCost; 
    }
    int rem(){ 
	return rem_f; 
    }
    int other(int x){
	return x == startNode ? endNode : startNode;
    }
};

#endif

