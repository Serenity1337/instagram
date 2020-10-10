 const constructDate = () => {
  let d = new Date()
  let year = d.getFullYear()
  let monthNumber = d.getMonth()
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let month = months[monthNumber]
  let day = d.getDate()
  let completeDate = `${day} ${month} ${year}`
  return completeDate
}

exports.constructDate = constructDate