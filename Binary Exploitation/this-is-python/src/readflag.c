#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    setreuid(geteuid(), geteuid());
    
    FILE *f = fopen("/root/flag.txt", "r");
    if (f == NULL) {
        printf("Error: flag.txt not found.\n");
        return 1;
    }
    
    char c;
    while ((c = fgetc(f)) != EOF) {
        putchar(c);
    }
    
    fclose(f);
    return 0;
}