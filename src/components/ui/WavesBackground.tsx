export default function WavesBackground() {
  return (
    <div className="waves-wrapper">
      <div className="waves-squares">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="waves-square" />
        ))}
      </div>
      <div className="waves-triangles">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="waves-triangle" />
        ))}
      </div>
      <div className="waves-circles">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="waves-circle" />
        ))}
      </div>
    </div>
  );
}
