import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase-config";

import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Menu } from "primereact/menu";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Rating } from "primereact/rating";
import { FloatLabel } from "primereact/floatlabel";
import { InputTextarea } from "primereact/inputtextarea";
import { SelectButton } from "primereact/selectbutton";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { BlockUI } from "primereact/blockui";

import { dataAdmin } from "../utils/auth";
import { readAnime } from "../utils/dataAnime";
import { readAllGenre } from "../utils/handleGenre";
import { readAllStatus } from "../utils/handleStatus";
import { Badge } from "primereact/badge";

import { addAnnouncement } from "../utils/handleAnnouncement";

const SidebarDashboard = () => {
  const navigate = useNavigate();
  const data = localStorage.getItem("data_user");
  const pengguna = JSON.parse(data);

  // disini khusus variabel yang digunakan untuk menampung data yang akan di upload
  // ke dalam database
  const [urlGambar, setUrlGambar] = useState("");
  const [rating, setRating] = useState("");
  const [itemGenre, setItemGenre] = useState([]);
  const [itemStatus, setItemStatus] = useState([]);
  const [sinopsis, setSinopsis] = useState("");

  // note: untuk itemStatus dan itemGenre nanti value nya mirip dengan
  //  nilai dari readAllgenre() atau readAllStatsu . exam: ['Supernatura', 'Action', ...] tergantung
  // seberapa banyak pilihan user

  const menuCogUser = useRef(null);

  const [menuActive, setMenuActive] = useState("home"); // ini variabel untuk menampung semua kontent body

  // ini variabel yang menampung nilai databse
  const [adminHomeList, setAdminHomeList] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const toast = useRef(null);
  const [totalSizeImage, setTotalSizeImage] = useState(0);
  const fileUploadRef = useRef(null);

  // ini variabel untuk option  selectbutton
  const [optionGenre, setOptionGenre] = useState([]);
  const [optionStatus, setOptionStatus] = useState([]);

  // variabel untuk penambahan genre dan status
  const [addInputGenre, setAddInputGenre] = useState([]);
  const [addInputStatus, setAddInputStatus] = useState([]);

  // Announcements variable
  const [announcement, setAnnouncement] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const onTemplateSelect = (e) => {
    if (e.files.length > 1) {
      toast.current.show({
        severity: "warn",
        summary: "Peringatan",
        detail: "Hanya boleh satu file",
      });
      fileUploadRef.current.clear();
      return;
    }

    let totalSize_ = e.files[0].size || 0;
    setTotalSizeImage(totalSize_);
  };

  const onTemplateUpload = async (e) => {
    const file = e.files[0];
    const storageRef = ref(storage, `folder_anime/${file.name}`);

    try {
      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);
      console.log(url);
      setUrlGambar(url);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Gagal upload gambar",
        detail: err.message,
      });
    }
  };

  const onTemplateRemove = (file, callback) => {
    setTotalSizeImage(totalSizeImage - file.size);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSizeImage(0);
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSizeImage / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSizeImage)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex-item-center gap-3 sm:ml-auto">
          <span className="dark:!text-gray-500 !mb-1">
            {formatedValue} / 1 MB
          </span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          />
        </div>
      </div>
    );
  };

  const uploadItemTemplate = (file, props) => {
    return (
      <div className="flex items-center gap-10 flex-wrap dark:!text-gray-500">
        <div className="flex items-center">
          <img
            src={file.objectURL}
            role="presentation"
            className="w-[60px] xs:w-[100px]"
            alt={file.name}
          />
          <span className="flex flex-col text-start ml-3 line-clamp-1">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="!px-3 !py-2 !hidden sm:!block"
        />
        <Button
          icon="pi pi-times"
          onClick={() => onTemplateRemove(file, props.onRemove)}
          className="!p-3 !py-3 !rounded-[50%] p-button-danger ms-auto sm:!block !hidden"
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex flex-col items-center">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  const itemsCogUser = [
    {
      label: pengguna.username,
      items: [
        {
          label: " Add",
          icon: () => <i className="fas fa-user-plus"></i>,
        },
        {
          label: "logout",
          icon: () => (
            <i className="fas fa-right-from-bracket text-red-500"></i>
          ),
          command: () => {
            localStorage.removeItem("status_login");
            localStorage.removeItem("status_login_fake");
            navigate("/");
          },
        },
      ],
    },
  ];

  useEffect(() => {
    (async () => {
      const data_admin_home = await dataAdmin();
      const data_anime = await readAnime();
      const data_genre = await readAllGenre();
      const data_status = await readAllStatus();

      setAdminHomeList(data_admin_home);
      setAnimeList(data_anime);
      setGenreList(data_genre);
      setStatusList(data_status);

      const genreListObject = data_genre.genre.map((item) => ({
        nama: item,
        value: item,
      }));
      const statusListObject = data_status.status.map((item) => ({
        nama: item,
        value: item,
      }));

      setOptionGenre(genreListObject);
      setOptionStatus(statusListObject);
    })();
  }, []);

  const handleSave = () => {
    toast.current.show({
      severity: "warn",
      summary: "Tidak dapat melakukan tindakan ini",
      detail: "Data sedang dalam pemeliharaan by dev asi-web",
    });
  };

  const removeGenreListPreview = (nameGenre) => {
    setGenreList((prev) => ({
      ...prev,
      genre: prev.genre.filter((item) => item !== nameGenre),
    }));
  };
  const addGenreListPreview = () => {
    const inputGenre = addInputGenre.trim();
    // Mencegah duplikasi data
    if (
      genreList.genre.some(
        (item) => item.toLowerCase() === inputGenre.toLowerCase()
      )
    ) {
      toast.current.show({
        severity: "warn",
        summary: `Genre "${inputGenre}" tidak sah`,
        detail: "Anda melakukan duplikasi genre!",
      });
      return;
    }
    setGenreList((prev) => ({ ...prev, genre: [...prev.genre, inputGenre] }));
    setAddInputGenre(""); // Clear input
  };
  const removeStatusListPreview = (nameStatus) => {
    setStatusList((prev) => ({
      ...prev,
      status: prev.status.filter((item) => item !== nameStatus),
    }));
  };
  const addStatusListPreview = () => {
    const inputStatus = addInputStatus.trim();
    // Mencegah duplikasi data juga
    if (
      statusList.status.some(
        (item) => item.toLowerCase() === inputStatus.toLowerCase()
      )
    ) {
      toast.current.show({
        severity: "warn",
        summary: `Status "${inputStatus}" tidak sah`,
        detail: "Anda melakukan duplikasi status!",
      });
      return;
    }
    setStatusList((prev) => ({
      ...prev,
      status: [...prev.status, inputStatus],
    }));
    setAddInputStatus(""); // Clear input
  };

  const sendSGtoFireStore = async () => {
    const genreRef = doc(db, "asi_web", "genre_choice");
    const statusRef = doc(db, "asi_web", "status_chocie");
    console.log(genreList, statusList);
    try {
      await updateDoc(genreRef, genreList);
      await updateDoc(statusRef, statusList);
      toast.current.show({
        severity: "success",
        sumary: "Berhasil!",
        detail: "Data genre & status berhasil diperbarui!",
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        sumary: "Gagal memperbarui data!",
        detail: err.message,
      });
    }
  };

  const bodyDashboard = () => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setFeedback(null);

      const waktu = new Date().toLocaleString("id-ID");

      const res = await addAnnouncement(announcement, waktu);
      setLoading(false);

      if (res.status) {
        setAnnouncement("");
        setFeedback({ status: true, message: res.message });
      } else {
        setFeedback({ status: false, message: res.message });
      }
    };

    return (
      <div className="mt-5">
        <span className="p-4 text-2xl font-extrabold text-gray-300 dark:text-gray-500">
          Dashboard
        </span>

        <div className="p-4 grid h-fit w-fit grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="flex flex-col items-center gap-4 border dark:border-gray-700 border-gray-300 rounded-md p-5 xs:p-10 h-fit w-full sm:w-[300px]">
            <div className="flex gap-6 items-center">
              <i className="fas fa-tv !text-[3rem] xs:!text-[4rem] text-yellow-300/50"></i>
              <div className="text-center">
                <p className="dark:text-gray-200 text-[.6rem] xs:text-base">
                  Jumlah Anime
                </p>
                <p className="text-gray-300 dark:text-gray-500 text-2xl xs:text-4xl font-extrabold">
                  {animeList.length}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 border dark:border-gray-700 border-gray-300 rounded-md p-5 xs:p-10 h-fit w-full sm:w-[300px]">
            <div className="flex gap-6 items-center">
              <i className="fas fa-user-ninja !text-[3rem] xs:!text-[4rem] text-blue-300/50"></i>
              <div className="text-center">
                <p className="dark:text-gray-200 text-[.6rem] xs:text-base">
                  Jumlah Admin
                </p>
                <p className="text-gray-300 dark:text-gray-500 text-2xl xs:text-4xl font-extrabold">
                  {adminHomeList.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 w-full max-w-2xl">
          <p className="text-slate-500 text-2xl font-bold mb-3">Announcement</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={4}
              placeholder="Tulis pengumuman di sini..."
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold"
            >
              {loading ? "Mengirim..." : "Kirim Pengumuman"}
            </button>
            {feedback && (
              <p
                className={`text-sm ${
                  feedback.status ? "text-green-500" : "text-red-500"
                }`}
              >
                {feedback.message}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  };
  
  const bodyAnime = () => {
    return (
      <BlockUI
        className="!items-start dark:!bg-gray-900/90 !pt-80"
        blocked={true}
        template={<i className="text-gray-600 pi pi-lock !text-[5rem]"></i>}
      >
        <div className="mt-5 overflow-y-auto max-h-[80vh] ">
          <span className="p-4 text-2xl font-extrabold text-gray-300 dark:text-gray-500">
            Tambah Anime
          </span>
          <div className="p-4">
            <span className="dark:text-gray-200">Judul anime</span>
            <div className="pb-2"></div>

            <div className="p-inputgroup">
              <span className="p-inputgroup-addon dark:!bg-gray-400/60 dark:!text-gray-200">
                <i className="pi pi-book"></i>
              </span>
              <InputText
                placeholder="Judul Anime"
                className="dark:!text-gray-200 dark:!bg-gray-700/60"
              />
            </div>

            <Divider className="!my-10" />

            <div className="mt-5">
              <span className="dark:text-gray-200">Upload gambar anime</span>
              <div className="pb-2"></div>
              <Tooltip
                target=".custom-choose-btn"
                content="Choose"
                position="bottom"
              />
              <Tooltip
                target=".custom-upload-btn"
                content="Upload"
                position="bottom"
              />
              <Tooltip
                target=".custom-cancel-btn"
                content="Clear"
                position="bottom"
              />
              <FileUpload
                ref={fileUploadRef}
                name="demo[]"
                customUpload
                multiple={false}
                accept="image/*"
                maxFileSize={1000000}
                uploadHandler={onTemplateUpload}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={uploadItemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
              />
            </div>

            <Divider className="!my-10" />

            <span className="dark:text-gray-200 mt-3">Rating</span>
            <div className="pb-2"></div>

            <div className="flex items-center gap-2 mb-3">
              <Rating
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                cancel={true}
              />
              <span>{rating}/5</span>
            </div>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon dark:!bg-gray-400/60 dark:!text-gray-200">
                <i className="pi pi-star text-yellow-400"></i>
              </span>
              <InputText
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Rating"
                className="dark:!text-gray-200 dark:!bg-gray-700/60"
              />
            </div>

            <Divider className="!my-10" />

            <span className="dark:text-gray-200 mt-3">Genre</span>
            <div className="pb-2"></div>
            <SelectButton
              onChange={(e) => setItemGenre(e.target.value)}
              optionLabel="nama"
              options={optionGenre}
              multiple
              value={itemGenre}
            />

            <Divider className="!my-10" />

            <span className="dark:text-gray-200 mt-3">Status</span>
            <div className="pb-2"></div>
            <SelectButton
              onChange={(e) => setItemStatus(e.target.value)}
              optionLabel="nama"
              options={optionStatus}
              multiple
              value={itemStatus}
            />

            <Divider className="!my-10" />

            <div className="group">
              <span className="dark:text-gray-200 group-focus-within:hidden">
                Deskripsi
              </span>
              <FloatLabel className="mt-3">
                <InputTextarea
                  id="description"
                  value={sinopsis}
                  onChange={(e) => setSinopsis(e.target.value)}
                  className="!w-full"
                  rows={5}
                />
                <label htmlFor="description">Deskripsi</label>
              </FloatLabel>
            </div>

            <Button
              icon="pi pi-save"
              className="!mt-4"
              label="Simpan"
              onClick={() => handleSave()}
            />
          </div>
        </div>
      </BlockUI>
    );
  };

  const bodyGenre = () => {
    return (
      <div className="p-4">
        <div>
          <div className="flex gap-2 flex-wrap mt-2">
            {genreList.length !== 0 ? (
              <>
                {genreList.genre.map((item, index) => (
                  <div
                    key={index}
                    className="
                                                                                                        relative p-overlay-badge
                                                                                                        cursor-pointer rounded-[50rem] px-3 hover:bg-gray-500/30 dark:text-gray-200
                                                                                                        py-2 flex items-center justify-center border border-gray-300 dark:border-gray-600
                                                                                "
                  >
                    {item}
                    <Badge
                      value="x"
                      severity="danger"
                      onClick={() => removeGenreListPreview(item)}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                <span className="text-gray-300 dark:text-gray-500">
                  Data belum termuat
                </span>
              </>
            )}
          </div>
          <Divider className="!mb-7" />
          <div className="flex items-center gap-2 mt-4 w-fit">
            <input
              type="text"
              placeholder="Tambahkan Genre"
              value={addInputGenre}
              onChange={(e) => setAddInputGenre(e.target.value)}
              className="text-[.9rem] xs:text-base w-full py-2 px-3 border focus:outline-gray-300 rounded-md border-gray-300"
            />
            <Button
              icon="pi pi-plus"
              className="!py-2 !px-3 !rounded-md"
              onClick={() => addGenreListPreview()}
            />
          </div>
        </div>
        <div className="mt-20">
          <div className="flex gap-2 flex-wrap mt-2">
            {statusList.length !== 0 ? (
              <>
                {statusList.status.map((item, index) => (
                  <div
                    key={index}
                    className="
                                                                                                        relative p-overlay-badge
                                                                                                        cursor-pointer rounded-[50rem] px-3 hover:bg-gray-500/30 dark:text-gray-200
                                                                                                        py-2 flex items-center justify-center border border-gray-300 dark:border-gray-600
                                                                                "
                  >
                    {item}
                    <Badge
                      value="x"
                      severity="danger"
                      onClick={() => removeStatusListPreview(item)}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                <span className="text-gray-300 dark:text-gray-500">
                  Data belum termuat
                </span>
              </>
            )}
          </div>
          <Divider className="!mb-7" />
          <div className="flex items-center gap-2 mt-4 w-fit">
            <input
              type="text"
              placeholder="Tambahkan Status"
              value={addInputStatus}
              onChange={(e) => setAddInputStatus(e.target.value)}
              className="text-[.9rem] xs:text-base w-full py-2 px-3 border focus:outline-gray-300 rounded-md border-gray-300"
            />
            <Button
              icon="pi pi-plus"
              className="!py-2 !px-3 !rounded-md"
              onClick={() => addStatusListPreview()}
            />
          </div>
          <Button
            icon="pi pi-save"
            label="simpan"
            className="!mt-4 !py-2 !px-3"
            onClick={() => sendSGtoFireStore(genreList.genre)}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Toast
        ref={toast}
        className="!text-[.55rem] xs:!text-[.7rem] lg:!text-sm"
      />
      <Splitter className="min-h-[85dvh] w-full dark:!bg-gray-800 !border-none">
        <SplitterPanel className="p-2" size={5} minSize={5}>
          <section className="dark:!text-gray-200 flex flex-col gap-10 items-center p-4 w-full">
            <div
              className={`item-dash ${menuActive === "home" ? "active" : ""}`}
              onClick={() => setMenuActive("home")}
            >
              <i className="fas fa-house-user"></i>
            </div>
            <div
              className={`item-dash ${menuActive === "anime" ? "active" : ""}`}
              onClick={() => setMenuActive("anime")}
            >
              <i className="fas fa-sliders"></i>
            </div>
            <div
              className={`item-dash ${menuActive === "genre" ? "active" : ""}`}
              onClick={() => setMenuActive("genre")}
            >
              <i className="fas fa-tags"></i>
            </div>
            <div className="item-dash" onClick={() => navigate("/")}>
              <i className="fas fa-circle-left"></i>
            </div>
            <Menu
              className="!gap-2 !w-auto rounde-[50rem] !text-[.8rem]"
              model={itemsCogUser}
              popup
              ref={menuCogUser}
              id="popup_menu_right"
              popupAlignment="right"
            />
            <div
              onClick={(event) => {
                menuCogUser.current.toggle(event);
                console.log(pengguna.username);
              }}
              aria-controls="popup_menu_right"
              aria-haspopup
            >
              <i className="fas fa-user-gear"></i>
            </div>
          </section>
        </SplitterPanel>
        <SplitterPanel className="" size={95}>
          {menuActive == "home" && bodyDashboard()}
          {menuActive == "anime" && bodyAnime()}
          {menuActive == "genre" && bodyGenre()}
        </SplitterPanel>
      </Splitter>
    </>
  );
};

export default SidebarDashboard;
