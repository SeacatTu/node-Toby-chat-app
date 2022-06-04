const users = []

//addUser,removeUser,getUser,getUserInRoom

const addUser= ({id, username, room })=>{
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username||!room){
       return{
           error: 'Username and room are required!'
       }
    }

    //Check for existing user
    const existingUser = users.find((user)=>{
         return user.room===room && user.username===username
    })
    
    //Validate name
    if(existingUser){
        return{
           error :'Username is in  use!'
        }
    }

    //Store the user
    const user = {id, username , room}
    users.push(user)
    return{user}
}

const removeUser = (id)=>{
  const index = users.findIndex((user)=>user.id===id)
  if(index!== -1){
      return users.splice(index,1)[0]
  }

}

const getUser = (id)=>{
    return users.find((user)=>user.id===id)
 }

 const getUserInRoom =(room)=>{
      room = room.trim().toLowerCase()
     return users.filter((user)=>user.room===room)
 }

module.exports={
    addUser,
    getUser,
    removeUser,
    getUserInRoom
}

//test
// addUser({
//     id:22,
//     username:'Toby',
//     room :'Taiwan'
// })
// addUser({
//     id:23,
//     username:'Toby2',
//     room :'Taiwan'
// })
// addUser({
//     id:24,
//     username:'Toby3',
//     room :'Taiwan2'
// })

// // console.log(users)
// // const res = addUser({
// //     id:33,
// //     username:'Camilla',
// //    // username:'',
// //     room :'Taiwan'
// // })
// // console.log(res)

// // const removedUser= removeUser(22)
// // console.log(removedUser)
// // console.log(users)

// // const user = getUser(24)
// // console.log(user)

// const userlist = getUserInRoom('Taiwan')
// console.log(userlist)