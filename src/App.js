import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Header(props) {
  return <header>
    <h1><a href='/' onClick={event=> {
      event.preventDefault();
      props.onChangeMode();
    }}>WEB</a></h1>
  </header>
}

function Nav(props) {
  let dis = []
  for (let i = 0; i < props.topics.length; ++i) {
    let t = props.topics[i];
    dis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event => {
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>
        {t.title}
      </a>
    </li>)
  }
  return <nav>
    <ol>
      {dis}
    </ol>
  </nav>
}

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=> {
    event.preventDefault();
    const title = event.target.title.value;
    const body = event.target.body.value;
    props.onChangeMode(title, body);
  }}>
    <p><input type='text' name='title' placeholder='title'></input></p>
    <p><textarea name='body' placeholder='body'></textarea></p>
    <p><input type='submit' value={"submit"}></input></p>
  </form>
  </article>
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return <article>
    <h2>Update</h2>
    <form onSubmit={event=> {
    event.preventDefault();
    const title = event.target.title.value;
    const body = event.target.body.value;
    props.onChangeMode(title, body);
  }}>
    <p><input type='text' name='title' value={title} onChange={(event) => {
      setTitle(event.target.value);
    }}></input></p>
    <p><textarea name='body' value={body} onChange={(event) => {
      setBody(event.target.value);
    }}></textarea></p>
    <p><input type='submit' value={"submit"}></input></p>
  </form>
  </article> 
}

function App() {
  const [mode, setMode] = useState("WELCOME");
  const [topics, setTopics] = useState([
    {id:1, title:"html", body:"Hello, html ..."},
    {id:2, title:"css", body:"Hello, css ..."},
    {id:3, title:"js", body:"Hello, js ..."}
  ])
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);

  let content = null;
  let context = null;
  if (mode == "WELCOME") {
    content = <><p>
    <h2>Welcome</h2>
    Hello, WEB</p>
    <li><a href="/Create/" onClick={event => {
      event.preventDefault();
      setMode("CREATE");
    }}>Create</a></li></>
  }
  else if (mode == "READ") {
    for (let i = 0; i < topics.length; ++i) {
      if (topics[i].id == id) {
        content = <><p>
          <h2>{topics[i].title}</h2>
          {topics[i].body}</p>
          <p><a href={'/update/'+id} onClick={event=> {
            event.preventDefault();
            setMode('UPDATE');
          }}><li>Update</li></a></p>
          <p><a href={'/delete/'+id} onClick={event=> {
            event.preventDefault();
            setMode('DELETE');
          }}><li>Delete</li></a></p>
          </>
      }
    }
  }
  else if (mode == "CREATE") {
    context = <Create onChangeMode={(_title, _body) => {
      const newTopic = {id:nextId, title:_title, body:_body};
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setId(nextId);
      setNextId(nextId+1);
      setMode("WELCOME");
    }}></Create>
  }
  else if (mode == "UPDATE") {
    let title = null;
    let body = null;
    for (let i = 0; i < topics.length; ++i) {
      if (id == topics[i].id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    context = <Update title={title} body={body} onChangeMode={(_title, _body) => {
      const updateTopic = {id:id, title:_title, body:_body};
      const updateTopics = [...topics];
      for (let i = 0; i < updateTopics.length; ++i) {
        if (id == updateTopics[i].id) updateTopics[i] = updateTopic;      
      }
      setTopics(updateTopics);
      setMode("READ");
    }}></Update>
  }
  else if (mode == "DELETE") {
    const newTopics = [];
    for (let i = 0; i < topics.length; ++i) {
      if (id != topics[i].id) newTopics.push(topics[i]);
    }
    setTopics(newTopics);
    setMode("WELCOME");
  }

  return <div><Header onChangeMode={() => {
    setMode("WELCOME");
  }}></Header>
  <Nav topics={topics} onChangeMode={(id) => {
    setId(id);
    setMode("READ");
  }}></Nav>
  {content}
  {context}
  </div>
}

export default App;