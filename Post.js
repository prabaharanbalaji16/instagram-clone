import React,{useState,useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase';
function Post({ username,caption,ImageUrl,postid,user }) {

    const [comments,setComments] =useState([]);
    const [comment,setComment] =useState('');

    useEffect(() => {
         let unsubscribe;
        if(postid){
           unsubscribe= db
                .collection("posts")
                .doc(postid)
                .collection("comments")
                .orderBy("timestamp","desc")
                .onSnapshot((snapshot) =>{
                    setComments(snapshot.docs.map((doc => doc.data())));
                } );
        }
        return() =>{
            unsubscribe();
        };
    },[postid]);

    const postComment =(event) => {
        event.preventDefault();
        db.collection("posts").doc(postid).collection("comments").add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment("");
    }
    return (

        <div className="post">

        <div className="post__header">
            <Avatar 
                className="post__avatar"
                src="./img.png"
                alt="Balaji" />
            <h3>{username}</h3>
        </div>
        
        <img className="post__image" src={ImageUrl}
             alt="react logo" />
        
        <h4 className="post__text"><strong>{username}</strong> {caption} </h4>

        <div className="post__comments">
            {
                comments.map((comment)=>(
                    <p>{comment.username} <strong>{comment.text}</strong></p>
                ))
            }
        </div>

        <form className="post__CommentBox">
            <input 
                className="post__input"
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button
                className="post__button"
                disabled={!comment}
                type="submit"
                onClick={postComment}
            >
                Post
            </button>
        </form>

        </div>
    )
}

export default Post
