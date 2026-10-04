// Keep full-size, upright labels apart as their elliptical paths cross.
// Retain a little of the previous correction so labels make room smoothly.
export function spaceMobilePills(targets, sizes, width, height, offsets) {
  const gap = 5
  const points = targets.map((target, i) => ({
    x: target.x + (offsets[i]?.x ?? 0) * 0.94,
    y: target.y + (offsets[i]?.y ?? 0) * 0.94,
  }))
  const contain = (point, i) => {
    point.x = Math.max(sizes[i][0] / 2 + gap, Math.min(width - sizes[i][0] / 2 - gap, point.x))
    point.y = Math.max(sizes[i][1] / 2 + gap, Math.min(height - sizes[i][1] / 2 - gap, point.y))
  }
  for (let pass = 0; pass < 16; pass++) {
    points.forEach(contain)
    let separated = true
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j]
        const overlapX = (sizes[i][0] + sizes[j][0]) / 2 + gap - Math.abs(b.x - a.x)
        const overlapY = (sizes[i][1] + sizes[j][1]) / 2 + gap - Math.abs(b.y - a.y)
        if (overlapX <= 0 || overlapY <= 0) continue
        separated = false
        const axis = overlapX < overlapY ? 'x' : 'y'
        const shift = ((axis === 'x' ? overlapX : overlapY) + 0.1) / 2
        const direction = b[axis] >= a[axis] ? 1 : -1
        a[axis] -= shift * direction
        b[axis] += shift * direction
      }
    }
    if (separated) break
  }
  points.forEach((point, i) => {
    contain(point, i)
    offsets[i] = { x: point.x - targets[i].x, y: point.y - targets[i].y }
  })
  return points
}
