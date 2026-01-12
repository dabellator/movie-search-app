import Card from './Card'

interface CrewCardProps {
  title: string
  items: string[]
}

const CrewCard = ({ title, items }: CrewCardProps) => {
  if (!items || items.length === 0) return null

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4 text-blue-400">{title}</h3>
      <ul className="space-y-2">
        {items.map((item: string, index: number) => (
          <li key={index} className="text-gray-300">
            {item}
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default CrewCard
