# 2017HuaWei_CraftCode
## 2017华为软件精英挑战赛      
### [我的博客](http://blog.csdn.net/fx677588)

### 大赛官网：http://codecraft.huawei.com/

### 赛题解读：http://mp.weixin.qq.com/s/on_l5Rc3Be-DjgUOXftaNw

### 赛题案例以及编译官方软件包：HUAWEI_Code_Craft_2017_软件包

　　花费了三个星期投入在这次2017华为精英挑战赛，可惜眼看着自己从靠前一点点的跌到64名开外，最后未能进入区域复赛，今年竞争异常激烈。
第一次参加这种类型的比赛，还是学到了不少东西的，下面分享一下自己的想法和比赛经验，只能叹高手如云。

　　我们比赛用到的算法主要分三个阶段，但核心搜索块都是最小费用最大流，这个是在确定服务器节点后，进行全局搜索分流到消费节点。
所以这个问题就转为了服务器选址的问题。
### 方法1：miniCost&ViolenceSearch
　　这个赛题明显是一个NP-Hard问题，最开始我们想用暴力的方法解决，首先与每个消费节点直接相连接的网络节点布局服务器（直连），然后全局网络节点考虑，
对服务器集合要么随机减一个要么换一个要么加一个，然后利用每次的服务器集合去计算费用流，直到最后获取最少一次费用的服务器布局。
###方法2：miniCost_onlyComsumeNode
　　第二个方法还是利用直连的方法布局初始服务器集合，其实我们只需要在当前直连服务器中随机减一个或者换一个就可以，直到收敛，取最少费用的一次服务器布局。
这个由于一直在直连网络节点中搜索，所以对服务器单价贵的情况有还不错的解，所以在规定时间内计算费用流时间缩减了很多，而且在大案例中有不错的解。
大案例中我们测试得出迭代次数可以多达3万多次，而第一种方法仅有3000多次，快了10万倍。其实在大案例中追求有限时间内搜索最优解还是很不错的idea。

　　其实很明显，上面两种方法都会遇到跳不出局部最优解的问题，一旦我们陷入一个局部最优解根本跳不出去，显然还是需要一个启发式的方法，经典的算法像蚁群，爬山，模拟退火，遗传算法，粒子群等，大家可以查阅相关论文，这些都是经典TSP问题很好的解决方法，用在这里肯定也是可行的。
我们最后在服务器选址使用的是模拟退火，算法简单又快速，这也是我们第三种算法。
### 方法3：doubleStage&simulatedAnnealing
　　第三种方法初始化还是使用的直连的方法，但是每次随机加一个服务器或者减一个或者换一个我们并不是将这个概率设死，不是对当前花费没有减小的效果就舍弃这次抉择，而是以一定概率去接受它，并且这个概率随着迭代深入慢慢减小，这就是经典的模拟退火的算法，一定程度上可以避免陷入局部最优。
### 待实现的方法：
　　但是很遗憾，想法是挺好的，由于没有经验，经过两天调参我们的效果还是不理想，根本没有解决陷入局部最优的困局。直到比赛结束这个问题也没有解决，最后很遗憾没有进入复赛。
  
　　其实解决局部最好方法就是增加随机性，一个是选择服务器的时候加大随机性，这里rand()所以使用时间作为srand参数自然是最好的。
  　
   另外初始服务器的随机性，所以一旦结果收敛我们应该重启再继续搜索，但是很遗憾这个方法我们没有时间实践了，就是服务器布局不要选择直连，而是全局随机选择跟消费节点数量相同的服务器，然后多次抉择直到收敛。
   
   我觉得我们失败就是败在了这里，有些遗憾，在最后才想明白。其它人的方法我就不知道，可能还有一些比较启发的选择方法，我们另外还根据每个网络节点的出度设计每个网络节点选择为服务器的权重，自然出度大情况我们更希望它被选择为服务器。
### 我们所做过的优化案例：
　　整个过程，我们对算法做了很多优化，虽然我们没有逃出局部最优解的困局，但是我敢说我们最小费用和整个算法优化是顶尖的。看讨论群里他们分享的速度都没有我们的快。
  
  　主要有以下的优化：
   
   1、费用流计算中不管中间路线布局，我们将多源多汇问题优化为单元对单元，也就是模拟设计两个超级节点，一个连接所有服务器，一个连接所有消费节点，整个过程简化为单源单汇费用流问题；
   
   2、每迭代一次不必重新加载所有图数据，我们采用个别数据还原再重新进行下一轮的最小费用流计算即可；
   
   3、服务器集合存储的时候，我们采用标准模板库中set数据结构其实是最好的，第一服务器不会重复set很符合这个性质，第二set是基于红黑树实现的，插入删除很快速，所以使用set比其他任何数据结构都要好，这个设计又让我们的算法效率提高了不少。
以上就是我的总结，虽然很遗憾没有进入复赛，但是过程还是学习了不少，继续加油！