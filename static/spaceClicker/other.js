function multiplyCost(cost, multiplier) {
  for (var resource in cost) {
    cost[resource] = int(cost[resource] * multiplier);
  }
}