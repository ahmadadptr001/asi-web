import { useState, useEffect, useRef } from "react";

import { db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from "primereact/dialog";

import { readAllGenre } from "../utils/handleGenre";
import { readAllStatus } from "../utils/handleStatus";
import { addComment } from "../utils/handleComment";
import { deleteComment } from "../utils/handleComment";
import { Toast } from "primereact/toast";

const Content = ({ anime, itemFilter }) => {
  // ini variabel buat chekcbox ya guys biar ketika ditekan ada bulat" biru
  const [ingredientGenre, setIngredientGenre] = useState("");
  const [ingredientStatus, setIngredientStatus] = useState("");
  const [genre, setGenre] = useState([]);
  const [status, setStatus] = useState([]);
  const [genreChoice, setGenreChoice] = useState("semua");
  const [statusChoice, setStatusChoice] = useState("");
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [timeNow, setTImeNow] = useState("");
  const [newComment, setNewComment] = useState("");
  const [selectedAnime, setSelectedAnime] = useState([]);
  const [keyComment, setKeyComment] = useState("");
  const toast = useRef(null);

  useEffect(() => {
    (async () => {
      const getGenre = await readAllGenre();
      const getStatus = await readAllStatus();
      setGenre(getGenre.genre);
      setStatus(getStatus.status);
    })();

    const now = new Date();
    const optionsConfigTime = { timeZone: "Asia/Jakarta" };
    const indoTime = new Date(now.toLocaleString("en-US", optionsConfigTime));

    const day = indoTime.getDate().toString().padStart(2, "0");
    const monthIndex = indoTime.getMonth();
    const year = indoTime.getFullYear();
    const hour = indoTime.getHours().toString().padStart(2, "0");
    const minute = indoTime.getMinutes().toString().padStart(2, "0");

    const bulanArray = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    const month = bulanArray[monthIndex];
    setTImeNow(`${day} ${month} ${year} ${hour}.${minute}`);
  }, []);

  const handleGenre = (event) => {
    setGenreChoice(event.target.value);
    setIngredientGenre(event.target.value);
  };

  const handleStatus = (event) => {
    setStatusChoice(event.target.value);
    setIngredientStatus(event.target.value);
  };

  const handleDialog = (item) => {
    setVisibleDialog(!visibleDialog);
    setSelectedAnime(item);
  };

  const handleSendComment = async (item) => {
    console.log(item);
    const resultSendComment = await addComment(item, newComment, timeNow);
    if (resultSendComment.status_comment !== true) {
      toast.current.show({
        severity: "error",
        summary: "Terjadi Kesalahan",
        detail: resultSendComment.message,
      });
      return;
    }
    const dataAnime = await getDoc(
      doc(db, "asi_web", "semua_data", "anime", item.id)
    );
    const animeBaru = {
      id: dataAnime.id,
      ...dataAnime.data(),
    };
    setSelectedAnime(animeBaru);
    toast.current.show({
      severity: "success",
      summary: "Operasi Berhasil",
      detail: resultSendComment.message,
    });
    setNewComment("");
  };

  const handleDeleteComment = async (komen) => {
    const res = await deleteComment(selectedAnime, komen);

    if (res.status_comment) {
      const updateKomentar = selectedAnime.komentar.filter(
        (item) => item !== komen
      );
      setSelectedAnime({ ...selectedAnime, komentar: updateKomentar });
      toast.current.show({
        severity: "success",
        summary: "Komentar dihapus",
        detail: "Komentar berhasil dihapus!",
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Gagal menghapus komen",
        detail: res.message,
      });
    }
  };

  const handleInputComment = (event) => {
    setNewComment(event.target.value);
    console.log(newComment);
  };

  const contentDialog = () => {
    return (
      <div>
        <Toast
          ref={toast}
          className="!text-[.55rem] xs:!text-[.7rem] lg:!text-sm"
        />
        <div className="flex items-center gap-3 !text-sm">
          <span className="rounded-[50rem] bg-violet-500 flex items-center gap-1 px-2 py-1 text-white">
            <i
              className={`fas fa-${
                selectedAnime.status === "Ongoing" ? "spinner" : "circle-check"
              }`}
            ></i>{" "}
            {selectedAnime.status}
          </span>
          <span className="items-center flex gap-1">
            <i className="fas fa-list"></i> {selectedAnime.jumlah_episode}{" "}
            Episode
          </span>
          <span className="flex items-center gap-1 ms-auto">
            <i className="fas fa-star text-yellow-300"></i>{" "}
            {selectedAnime.rating}/5
          </span>
        </div>
        <div className="mt-5">
          <img
            src={selectedAnime.gambar}
            alt="gambar anime"
            className="w-full rounded-md object-cover h-[250px]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1 mt-4 !text-sm">
          <span className="flex items-center gap-1">
            <i className="fas fa-tags"></i> <b>Genre:</b>
          </span>
          <span className="flex items-center gap-1 flex-wrap">
            {selectedAnime.genre.map((genre) => (
              <span className="px-3 py-1 rounded-[50rem] bg-sky-400">
                {genre}
              </span>
            ))}
          </span>
        </div>
        <div className="!text-sm mt-3">
          <div className="gap-1">
            <i className="fas fa-align-left"></i>{" "}
            <span className="font-bold">Deskripsi: </span>
            {selectedAnime.sinopsis}
          </div>
        </div>

        <Divider />

        <div id="komentar" className="!text-sm !mt-7">
          <span className="flex items-center gap-2">
            <i className="fas fa-comments"></i> Komentar (
            {selectedAnime.komentar.length})
          </span>
          <div className="mt-4">
            {selectedAnime.komentar.length === 0 ? (
              <>
                <p className="text-center">
                  Belum ada komentar. Jadilah yang pertama!
                </p>
              </>
            ) : (
              <div className="overflow-y-auto max-h-[300px] pb-6">
                {selectedAnime.komentar.map((komen, index) => (
                  <div key={index} className="p-4 pb-2 rounded-md relative">
                    <div>
                      <Divider />
                      <p
                        className={`flex items-center justify-between gap-2 ${
                          komen.nama === "Admin" ? "text-sky-500" : ""
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <i
                            className={`fas fa-user${
                              komen.nama === "Admin" ? "-check" : ""
                            }`}
                          ></i>
                          {komen.nama}
                        </span>

                        {/* Tombol hapus */}
                        {localStorage.getItem("status_login_fake") && (
                          <button
                            onClick={() => handleDeleteComment(komen)}
                            className="text-red-500 hover:text-red-700"
                            title="Hapus komentar"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </p>
                      <p className="mt-2"> {komen.komen} </p>
                      <p className="flex items-center gap-1 mt-2 !text-[.7rem]">
                        <i className="fa fa-clock"></i> {komen.waktu}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div id="komentar-anda" className="mt-6">
          <textarea
            onChange={handleInputComment}
            value={newComment}
            className="w-full focus:outline-gray-300 h-[100px] border border-gray-200 rounded-md p-4 !text-sm"
            placeholder="Tulis Komentar Anda"
          ></textarea>
        </div>

        <div id="action_" className="my-6">
          <button
            onClick={() => handleSendComment(selectedAnime)}
            className="flex justify-center items-center gap-2 w-full text-white p-3 !text-sm rounded-md border-none focus:outline-none bg-blue-500"
          >
            <i className="fas fa-paper-plane"></i> Kirim Komentar
          </button>
          <button
            onClick={() => {
              window.open(
                `https://wa.me/+62895355541144?text=Pertanyaan tentang anime: ${selectedAnime.judul}`,
                "_blank"
              );
            }}
            className="flex justify-center items-center mt-3 gap-2 w-full text-white p-3 !text-sm rounded-md border-none focus:outline-none bg-green-500"
          >
            <i className="fab fa-whatsapp"></i> Tanya Admin tentang Anime Ini
          </button>
        </div>
      </div>
    );
  };

  const templateCardAnime = (item) => {
    return (
      <div key={item.id} id="card" className="rounded-sm">
        <div
          id="card-header"
          className="bg-blue-400 p-4 rounded-tl-lg rounded-tr-lg"
        >
          <span id="title" className="font-semibold text-lg">
            {item.judul}
          </span>
          <span className="px-3 py-1 flex items-center my-2 text-[.9rem] gap-1 rounded-[50rem] bg-fuchsia-500 w-fit text-white">
            <i
              className={`fas fa-${
                item.status == "Ongoing" ? "spinner" : "circle-check"
              } !text-[.75rem]`}
            ></i>{" "}
            {item.status}
          </span>
        </div>
        <div id="card-body" className="h-[460px] flex justify-between flex-col">
          <div>
            <img
              src={item.gambar}
              alt="anime"
              className="w-full h-[190px] object-cover"
            />
            <div className="p-3">
              <div className="flex flex-wrap items-center gap-2">
                {item.genre.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 my-2 text-[.8rem] rounded-[50rem] bg-yellow-400 w-fit"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <p id="deskripsi" className="line-clamp-3 mt-2">
                {item.sinopsis}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleDialog(item)}
            className=" w-full flex items-center justify-center rounded-lg gap-2 p-3 mb-5 bg-blue-400 text-white"
          >
            <i className="pi pi-info-circle"></i>
            Lihat Detail
          </button>
        </div>
      </div>
    );
  };

  return (
    <section
      id="content"
      className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 p-3 my-5"
    >
      <Dialog
        header={selectedAnime.judul}
        className="custom-dialog w-[92%] sm:w-[80vw] md:w-[65vw] xs:w-[94%] lg:w-[50vw]"
        visible={visibleDialog}
        onHide={() => setVisibleDialog(!visibleDialog)}
      >
        {selectedAnime.length !== 0 ? contentDialog() : ""}
      </Dialog>
      <div className="genre-status-container rounded-2xl p-5 bg-white/60 dark:bg-glass-dark shadow-lg backdrop-blur-md border border-gray-200 dark:border-glass-border transition-all duration-300 md:sticky md:top-4 md:h-[90vh]">
        <p className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
          Genre
        </p>

        <div className="flex flex-wrap gap-4">
          {genre.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <RadioButton
                inputId={`${item}_`}
                name="genres"
                value={item}
                onChange={handleGenre}
                checked={ingredientGenre === item}
              />
              <label
                htmlFor={`${item}_`}
                className="text-sm text-gray-700 dark:text-gray-200"
              >
                {item}
              </label>
            </div>
          ))}
        </div>

        <Divider className="my-6" />

        {genreChoice && (
          <>
            <p className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Status
            </p>

            <div className="flex flex-wrap gap-4">
              {status.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <RadioButton
                    inputId={`${item}_`}
                    name="genres"
                    value={item}
                    onChange={handleStatus}
                    checked={ingredientStatus === item}
                  />
                  <label
                    htmlFor={`${item}_`}
                    className="text-sm text-gray-700 dark:text-gray-200"
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div
        id="list-anime"
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 p-3 bg-gray-200 dark:bg-gray-800 dark:!text-white rounded-md"
      >
        {typeof itemFilter === "string" ? (
          <p className="text-2xl">
            <span className="text-red-500 underline font-extrabold">
              {itemFilter}
            </span>{" "}
            tidak ditemukan
          </p>
        ) : (
          <>
            {anime
              .filter((item) => {
                const matchJudul =
                  itemFilter.length !== 0 && itemFilter !== undefined
                    ? item.judul.toLowerCase() ===
                      itemFilter.judul.toLowerCase()
                    : true;

                const matchGenre =
                  genreChoice.toLowerCase() !== "semua"
                    ? item.genre.includes(genreChoice)
                    : true;

                const matchStatus =
                  statusChoice !== "" && statusChoice !== undefined
                    ? item.status.includes(statusChoice)
                    : true;

                return matchJudul && matchGenre && matchStatus;
              })
              .map((item) => templateCardAnime(item))}
          </>
        )}
      </div>
    </section>
  );
};

export default Content;
