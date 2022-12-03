import string


def priority(char):
    return (string.ascii_lowercase + string.ascii_uppercase).index(char) + 1


def part_one(rucksacks):
    types = []
    for rucksack in rucksacks:
        length = len(rucksack)
        half = length // 2
        first = rucksack[:half]
        second = rucksack[half:]

        types.append(list(set(first).intersection(set(second)))[0])

    return sum(map(priority, types))


def part_two(rucksacks):
    badges = []
    for i in range(0, len(rucksacks), 3):
        badges.append(
            list(set(rucksacks[i]).intersection(
                set(rucksacks[i+1])).intersection(set(rucksacks[i+2])))[0]
        )

    return sum(map(priority, badges))


with open("./inputs/day3.txt") as f:
    rucksacks = list(map(lambda str: str.strip(),  f.readlines()))

    print(part_one(rucksacks))
    print(part_two(rucksacks))
