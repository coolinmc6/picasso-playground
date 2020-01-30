// =============================================
// Given a "table", build the required matrix for picasso
// cols => Array of column headers (String)
//    example: ["Sector", "Revenue"]
// dataRows => Array of "table rows" (Arrays of values)
//    example: [ ["Healthcare", 121000], ["Consumer Staples", 343319]]
function buildMatrix({ cols, dataRows }) {

  return {
    type: "matrix",
    data: [
      [...cols],
      [...dataRows]
    ]
  }
}