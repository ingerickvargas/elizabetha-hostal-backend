export const hasDateOverlap = (
  existingStart: Date,
  existingEnd: Date,
  requestedStart: Date,
  requestedEnd: Date
) => {
  return existingStart < requestedEnd && existingEnd > requestedStart
}
