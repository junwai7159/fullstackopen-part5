const Notification = ({ message, isError }) => (
  <div>
    {message === null
      ? <></>
      : <div className={isError ? 'error' : 'note'}>{message}</div>
    }
  </div>  
)

export default Notification