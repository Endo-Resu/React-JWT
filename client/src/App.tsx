import React, {useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {UserInterface} from "./models/UserInterface";
import UserService from "./services/UserService";

const App: React.FC = () => {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<UserInterface[]>([]);


    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    if (store.isLoading) {
        return (
            <div>Загрузка</div>
        )
    }

    if (!store.isAuth) {
        return (
            <LoginForm />
        )
    }

  return (
      <div>
          <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'Пользователь не авторизован'}</h1>
          <h2>{store.user.isActivated ? 'Аккаунт активирован' : 'Аккаунт не активирован'}</h2>
          <button onClick={() => store.logout()}>Выйти</button>
          <button onClick={getUsers}>Получить список пользователей</button>
          {users?.map(user =>
              <div key={user.email}>{user.email}</div>
          )}
      </div>
  )
}

export default observer(App);
