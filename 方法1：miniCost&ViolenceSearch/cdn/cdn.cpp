#include "cdn.h"
#include "lib_time.h"

clock_t start;

int main(int argc, char *argv[])
{
    start = clock();     //程序开始计时

    //print_time("Begin");
    char *topo[MAX_EDGE_NUM];
    int line_num;

    char *topo_file = argv[1];
    line_num = read_file(topo, MAX_EDGE_NUM, topo_file);

    char *result_file = argv[2];
    deploy_server(topo, line_num, result_file);
    release_buff(topo, line_num);
    //print_time("End");

    return 0;
}

