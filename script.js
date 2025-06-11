'use strict'
const table = document.querySelector('table'); // 表
const todo = document.getElementById('todo'); // TODO
const priority = document.querySelector('select'); // 優先度
const deadline = document.querySelector('input[type="date"]'); // 締め切り
const submit = document.getElementById('submit'); // 登録ボタン

// TODO登録ボタン
submit.addEventListener('click', () => {
    const item = {}; // 入力値を一時的に格納するオブジェクト
    item.todo = todo.value;
    item.priority = priority.value;

    /*
    if (deadline.value === '') {
        window.alert('期日を入力してください'); // 期日入力アラート
        return;
    }
    */

    if (deadline.value != '') {
        item.deadline = deadline.value;
    } else {
        const date = new Date(); //本日の日付情報を取得
        item.deadline = date.toLocaleDateString(); // 日付の体裁を変更
    }

    item.done = false; // 完了はひとまずBoolean値で設定

    console.log(item); // 確認してみる

    // フォームをリセット
    todo.value = '';
    priority.value = '普';
    deadline.value = '';

    const tr = document.createElement('tr'); // tr要素を生成

    // オブジェクトの繰り返しはfor-in文
    for (const prop in item) {
        const td = document.createElement('td'); // td要素を生成
        td.textContent = item[prop]; // ブラケット記法
        tr.appendChild(td); // 生成したtd要素をtr要素に追加
    }

    table.append(tr); // trエレメントをtable要素に追加
});