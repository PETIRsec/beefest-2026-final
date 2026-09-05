flag = "BEECTF{th1s_1s_n0t_a_d3c0y_#realflag_#congratulationyougottheflag!!!}" 
magic_byte = 0x55 # Key

hex_array = []
for char in flag:
    hex_array.append(hex(ord(char) ^ magic_byte))

print(f"Result:\n{', '.join(hex_array)}")
