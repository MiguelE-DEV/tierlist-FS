document.querySelectorAll('.deleteBtnI').forEach(element => {
  element.addEventListener('click', (e)=>{
    let id = e.target.parentElement.children[1].innerText
    let name = e.target.parentElement.parentElement.children[0].innerText.toLowerCase()
    console.log(e.target.parentElement.parentElement.children[0].innerText, e.target.parentElement.children[1].innerText)
    fetch('delete', {
      method: 'delete',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({
        'name': name,
        '_id': id
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      window.location.reload(true)
    })
  })
})
document.querySelectorAll('.editBtnI').forEach(element => {
    element.addEventListener('click', (e)=>{
      console.log(e.target.parentElement.parentElement.children)
      let name = prompt('1.) Enter new Item name', e.target.parentElement.parentElement.children[0].innerText)
      name = name.toLowerCase()
        if(name){
          var rank = prompt('2.) Now enter new Item rank, ex. B-Tier')
          let rankArray = [
            'S-Tier',
            'A-Tier',
            'B-Tier',
            'C-Tier',
            'D-Tier',
            'E-Tier'
          ]
          if(!rankArray.includes(rank)){
            alert('Please enter a valid rank, ex. C-Tier')
            return
          }
        }else{
          alert('You didnt enter anything!')
          return
        }
      let id = e.target.parentElement.parentElement.children[2].children[1].innerText
      fetch('update', {
        method: 'put',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({
          'name':name,
          'rank':rank,
          '_id': id
        })
      }).then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        window.location.reload(true)
      })
    })
  })