def reverse(n):
    x = 0
    if n < 0:
        t = -1 * n
        while t > 0:
            d = t % 10
            x = x * 10 + d
            t //= 10
        return -1 * x
    else:
        while n > 0:
            d = n % 10
            x = x * 10 + d
            n //= 10
        return x


n = -120
res = reverse(n)
print(res)
