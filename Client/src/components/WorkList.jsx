import WorkCard from "./WorkCard";



// eslint-disable-next-line react/prop-types
export default function WorkList({ data }) {
  return (
    <div className="p-[0px_40px_120px] flex flex-wrap gap-5 justify-center">
       {/* eslint-disable-next-line react/prop-types */}
      {data.map((work)=> (
        <WorkCard
        key = {work.id}
        work = {work}
        />
      ))}
    </div>
  )
}
