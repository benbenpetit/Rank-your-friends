export const getRankingOfQuestion = (rankings: string[][]) => {
  const participantScores: Record<
    string,
    { totalRank: number; count: number }
  > = {}

  rankings.forEach((ranking) => {
    ranking.forEach((participant, index) => {
      const rank = index + 1

      if (!participantScores[participant]) {
        participantScores[participant] = { totalRank: 0, count: 0 }
      }

      participantScores[participant].totalRank += rank
      participantScores[participant].count += 1
    })
  })

  const averagedScores = Object.entries(participantScores).map(
    ([participant, { totalRank, count }]) => {
      return {
        participant,
        averageRank: totalRank / count
      }
    }
  )

  averagedScores.sort((a, b) => a.averageRank - b.averageRank)

  return averagedScores.map(({ participant }) => participant)
}
