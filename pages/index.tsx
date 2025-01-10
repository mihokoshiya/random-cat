import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";

// getServerSidePropsから渡されるpropsの型
type Props = {
  initialImageUrl: string;
};

const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  // useStateを使って状態を定義
  const [imageUrl, setrImageUrl] = useState(initialImageUrl); // 初期値を渡す
  const [loading, setLoading] = useState(false); // 初期状態はfalseに

  // APIから猫の画像情報を取得する処理
  // useEffect(() => {
  //   // useEffectに'async'は使用できないのでthenを使用
  //   fetchImage().then((newImage) => {
  //     setrImageUrl(newImage.url); // 画像URLの状態を更新する
  //     setLoading(false); // ローディング状態を更新する
  //   });
  // }, []); // 第二引数は空(コンポーネントがマウントされたときのみ実行する)

  // ボタンをクリックしたときに画像を読み込む処理
  const handleClick = async () => {
    setLoading(true); // 読込中フラグを立てる
    const newImage = await fetchImage();
    setrImageUrl(newImage.url); // 画像URｌの状態を更新する
    setLoading(false); // 読込中フラグを倒す
  };

  // JSXの式にはif等の文が使用できないため論理演算子や三項演算子を使用
  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>
        One more cat!
      </button>
      <div className={styles.frame}>
        {loading || <img src={imageUrl} className={styles.img} />}
      </div>
    </div>
  );
};

export default IndexPage;

// サーバーサイドで実行する処理（画像情報を取得）
// Next.jsに認識させるためにexportする必要あり
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};

type Image = {
  url: string;
};

const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images = await res.json();
  console.log(images);
  return images[0];
};
