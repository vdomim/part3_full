const Notification = ({ message, infoType}) => {
  if (message === null) {
    return null
  }
  if(infoType==="error"){
    return (
      <div className="error">
        {message}
      </div>
    )
  }else{
    return(
      <div className="successful">
        {message}
      </div>
    )
  }
}

export default Notification