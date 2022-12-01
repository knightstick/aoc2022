
def parse_calories(string):
    elves = [[int(str) for str in elf.split("\n")]
             for elf in string.strip().split("\n\n")]
    return [sum(elf) for elf in elves]


def most_calories(string):
    return max(parse_calories(string))


def three_most_calories(string):
    totals = reversed(sorted(parse_calories(string)))
    return sum(list(totals)[0:3])


with open("./inputs/day1.txt") as f:
    content = f.read()
    print(most_calories(content))
    print(three_most_calories(content))
