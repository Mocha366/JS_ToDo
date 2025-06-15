'use strict'
const storage = localStorage;
const table = document.querySelector('table'); // 表
const todo = document.getElementById('todo'); // TODO
const priority = document.querySelector('select'); // 優先度
const deadline = document.querySelector('input[type="date"]'); // 締め切り
const submit = document.getElementById('submit'); // 登録ボタン

const updateTaskStats = () => {
    const total = list.length;
    const done = list.filter(item => item.done).length;
    const undone = total - done;

    document.getElementById('total-count').textContent = total;
    document.getElementById('done-count').textContent = done;
    document.getElementById('undone-count').textContent = undone;
};

let list = []; // TODOリスト

document.addEventListener('DOMContentLoaded', () => {
    // 1. ストレージデータ(JSON)の読み込み
    const json = storage.todoList;
    if (json == undefined) {
        return;
    }

    // 2. JSONをオブジェクトの配列に変換して配列listに代入
    list = JSON.parse(json);

    // 3. 配列listのデータを元にテーブルに要素を追加
    console.log(list);
    for (const item of list) {
        addItem(item);
    }

    updateTaskStats();
});

const addItem = (item) => {
    const tr = document.createElement('tr'); // tr要素を生成

    const keys = ['todo','priority','deadline','done'];

    keys.forEach((key) => {
        const td = document.createElement('td'); // td要素を生成

        if(key === 'done') {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.done;
            td.appendChild(checkbox);
            checkbox.addEventListener('change', checkBoxListener);
        } else {
            td.textContent = item[key]; // ブラケット記法
        }
        tr.appendChild(td); // 生成したtd要素をtr要素に追加
    });
    table.append(tr); // trエレメントをtable要素に追加
}

updateTaskStats();

const checkBoxListener = (ev) => {
    // 1-1. テーブル全tr
    const trList = Array.from(document.getElementsByTagName('tr'));

    // 1-2. チェックボックスの親(td)の親(tr)を取得
    const currentTr = ev.currentTarget.parentElement.parentElement;

    // 1-3. 配列.indexOfメソッドで何番目(インデックス)かを取得
    const idx = trList.indexOf(currentTr) - 1;

    // 2. 配列listにそのインデックスでアクセスしてdoneを更新
    list[idx].done = ev.currentTarget.checked;

    // 3. ストレージデータを更新
    storage.todoList = JSON.stringify(list);
}

const clearTable = () => {
    const trList = Array.from(document.getElementsByTagName('tr'));
    trList.shift();
    for (const tr of trList) {
        tr.remove();
    }
};

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

    // フォームをリセット
    todo.value = '';
    priority.value = '普';
    deadline.value = '';

    addItem(item);
    updateTaskStats();

    list.push(item);
    storage.todoList = JSON.stringify(list);
});

const filterButton = document.createElement('button'); // ボタン要素を生成
filterButton.textContent = '優先度（高）で絞り込み';
filterButton.id = 'priority'; // CSSでの装飾用
const main = document.querySelector('main');
main.appendChild(filterButton);

filterButton.addEventListener('click', () => {
    clearTable();
    updateTaskStats();

    for (const item of list) {
        if(item.priority == '高') {
            addItem(item);
        }
    }
});

const remove = document.createElement('button');
remove.textContent = '完了したTODOを削除する';
remove.id = 'remove'; // CSS装飾用
const br = document.createElement('br'); // 改行したい
main.appendChild(br);
main.appendChild(remove);

remove.addEventListener('click', () => {
    clearTable();

    // 1. 未完了のTODOを抽出して定数listを置き換え
    list = list.filter((item) => item.done == false);

    // 2. TODOデータをテーブルに追加
    for (const item of list) {
        addItem(item);
    }

    // 3. ストレージデータを更新
    storage.todoList = JSON.stringify(list);

    updateTaskStats();
});