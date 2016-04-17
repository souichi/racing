declare module milkcocoa {
  export class MilkCocoa {
    constructor(url: string);
    dataStore<T>(name: string): DataStore<T>;
  }

  export class DataStore<T> {
    /**
    * データストアに新しいデータを追加するメソッドです。
    * @param object データストアへプッシュするデータをオブジェクト形式で渡します。このときデータストア要素のIDは自動で付加されます。
    * @param callback(data) プッシュが完了した際のコールバックを指定することができます。省略可能です。
    * 戻り値はありません。
    */
    push(object: T, callback?: (data: IEventData<T>) => void): void;

    /**
    * データストアの要素を更新、追加するメソッドです。
    * @id 更新したいデータストア要素のidを指定します。
    * @data 更新、追加するデータを引数として渡します。
    * 戻り値はありません。
    */
    set(id: string, data: T): void;

    /**
    * データストアからデータを削除するメソッドです。
    * @id 削除したいデータストア要素のidを渡します。
    * 戻り値はありません。
    */
    remove(id): void;

    /**
    * データストアをにデータを保存しないデータの送信を行うことが出来ます。
    * このメソッドによって、同じデータストアのsendイベントを監視しているクライアントにデータを送信することが出来ます。
    * @object 相手に送りたいオブジェクトを渡すことができます。
    * 戻り値はありません。
    */
    send(object: T): void;

    /**
    * データストアにイベントを登録するメソッドです。 子のデータストアに関する変更に関してもイベントを監視できます。
    * @event イベントをstring形式で指定することができます。
    * @callback(data) 指定したイベントに対するコールバックを設定できます。
    * 戻り値はありません。
    */
    on(event: string, callback: (data: IEventData<T>) => void): void;

    /**
    * データストアに登録されたイベントを解除します。
    * @event 登録を解除したいイベント名を渡します。
    * 戻り値はありません。
    */
    off(event: string): void;

    /**
    * 特定のデータストア要素をidを指定して取得することができます。
    * @id データストア要素のID
    * @callback(err, data) コールバック関数を渡すことが出来ます。
    * 戻り値はありません。
    */
    get(id: string, callback: (err: string, data: IEventData<T>) => void): void;

    /**
    * データストアからデータを取得するオブジェクトである、Streamオブジェクトを取得するメソッドです。
    * @return Streamオブジェクトを返します。Streamオブジェクトに関してはこちらを御覧ください。
    */
    stream():Stream<T>;
  }

  export interface IEventData<T> {
    err: string;
    path: string;
    id: string;
    value: T;
  }

  export class Stream<T> {
    /**
    * 一回で取得するデータの個数を決めるためのメソッドです。
    * @param データサイズを指定します。
    * @return 条件が追加されたStreamオブジェクトを返します。
    */
    size(num: number): Stream<T>;

    /**
    * 指定した要素でデータをソートする条件を追加するメソッドです。
    * @mode ソートの昇順、降順を指定します。(asc, desc)
    * @return 条件が追加されたStreamオブジェクトを返します。
    */
    sort(mode: string): Stream<T>;

    /**
    * データの取得を開始するメソッドです。追加された検索条件を元にデータストアからデータを取得し、指定したコールバック関数に渡すことが出来ます。
    * @callback データの取得が完了した際に呼ばれるコールバックを指定します。コールバックの引数に取得したデータを含むオブジェクトが渡されます。
    */
    next(callback: (data: IEventData<T>) => void): void;
  }
}

import MilkCocoa = milkcocoa.MilkCocoa;
import DataStore = milkcocoa.DataStore;
import Stream = milkcocoa.Stream;
