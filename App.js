import React,{useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import {auth, db} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [openSignin,setopenSignin] = useState(false);
  const [username,setUsername] = useState('');
  const [email,setEmail] =useState('');
  const [password,setPassword] =useState('');
  const [user,setUser] =useState(null);

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const signup = (event) =>{
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error) => {alert(error.message)});
    setOpen(false);
  }

  const signin =(event) =>{
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email,password)
      .catch((error) => {alert(error.message)});
      setopenSignin(false);
  }

  useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        setUser(authUser);
        }else{
        return setUser(null);
      }
    })
    return ()=>{
      unsubscribe();
    }
  },[user,username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestap','desc').onSnapshot(snapshot =>{
      setPosts(snapshot.docs.map(doc =>({
        id:doc.id,
        post:doc.data()
      })))
    })
  },[])

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={()=>setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__form">
              <center>
                  <img 
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"  alt="instagram logo"/>
              </center>
              <Input 
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />
              <Input 
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} />      
              <Input 
                  type="text"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              <Button onClick={signup}>Sign Up</Button>
          </form>  
        </div>
      </Modal>
      <Modal
        open={openSignin}
        onClose={()=>setopenSignin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__form">
              <center>
                <img 
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"  alt="instagram logo"/>
              </center>
              <Input 
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />     
              <Input 
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
              <Button onClick={signin}>Sign In</Button>
          </form>
        </div>
      </Modal> 
      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"  alt="instagram logo"/>
        {user ?
          <Button onClick={()=>auth.signOut()}>Logout</Button> :
          <div className="app__loginContainer">
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
            <Button onClick={()=>setopenSignin(true)}>Sign In</Button>
          </div>
        }
      </div>
        <div className="app_posts">
        {
          posts.map(({id,post}) =>(
            <Post key={id}
            user={user}
              postid={id}
              username={post.username} 
              caption={post.caption}
              ImageUrl={post.ImageUrl}/>
          ))
        }
        </div>
        <InstagramEmbed
          url='https://www.instagram.com/p/CJJHuqCFAfV/'
          
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
   
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ):
      (
        <h3>LOGIN TO UPLOAD</h3>
      )}
    </div>
  );
}

export default App;
