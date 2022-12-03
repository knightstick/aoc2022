def positive_mod(a, b, mod):
    result = (b - a) % mod
    if result < 0:
        result = mod + result
    return result


def parse(char):
    return {
        'A': 0,
        'B': 1,
        'C': 2,
        'X': 0,
        'Y': 1,
        'Z': 2,
    }[char]


def score_result(opp, you):
    result = positive_mod(opp, you, 3)
    # Draw
    if (result == 0):
        return 3
    # Win
    if (result == 1):
        return 6
    # Lose
    if (result == 2):
        return 0


def pick(round):
    [oppStr, result] = round
    opp = parse(oppStr)

    choice = {
        # Lose
        'X': opp - 1,
        # Draw
        'Y': opp,
        # Win
        'Z': opp + 1,
    }[result]

    return positive_mod(0, choice, 3)


def part_one(lines):
    rounds = [line.split(" ") for line in [line.rstrip()
                                           for line in lines]]
    choices = [[parse(round[0]), parse(round[1])] for round in rounds]
    return sum([you + 1 + score_result(opp, you) for [opp, you] in choices])


def part_two(lines):
    rounds = [line.split(" ") for line in [line.rstrip()
                                           for line in lines]]
    choices = [[parse(round[0]), pick(round)] for round in rounds]
    return sum([you + 1 + score_result(opp, you) for [opp, you] in choices])


with open("./inputs/day2.txt") as f:
    lines = f.readlines()
    print(part_one(lines))
    print(part_two(lines))
