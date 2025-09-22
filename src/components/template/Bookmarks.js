import { useEffect, useState } from "react";

import "./Bookmarks.css";

const urls = [
  "https://www.instagram.com/p/DOJtG9QDOmZ/",
  "https://x.com/GlobalOrthodox/status/1968773018563338349",
  "https://churchsupplies.jordanville.org/products/the-jesus-prayer-and-its-application?srsltid=AfmBOorw_2VIA9hk1W889niD_j5hCsHfqACkzs7VqYLcFkwC2UV9_Y6_",
  "https://www.holycross.org/products/unseen-warfare",
  "https://www.unrealengine.com/en-US/blog/damage-in-ue4",
  "https://www.tomlooman.com/unreal-engine-cpp-guide/",
  "https://music.youtube.com/watch?v=6h69W_Ymu8Q",
  "https://open.spotify.com/playlist/37i9dQZF1E35mqYYio36nV",
  "https://www.instagram.com/explore/",
  "https://www.instagram.com/ikonebeliandjeo/",
  "https://www.facebook.com/photo/?fbid=1212045730963532&set=a.556336903201088",
  "https://www.facebook.com/",
  "https://www.facebook.com/reel/688123404275472",
  "https://dev.epicgames.com/documentation/en-us/unreal-engine/texture-compression-settings?application_version=4.27",
  "https://www.amazon.com/",
  "https://www.amazon.com/gp/buyagain/ref=pd_hp_d_atf_rp_1?ie=UTF8&ats=eyJleHBsaWNpdENhbmRpZGF0ZXMiOiJCMDlWRlNUSjhRIiwiY3VzdG9tZXJJZCI6IkEzSkZEQ1EyQUNQRk4wIn0%3D&pd_rd_w=jOzhG&content-id=amzn1.sym.656f4ac6-5db6-4803-8583-5963d5a36082&pf_rd_p=656f4ac6-5db6-4803-8583-5963d5a36082&pf_rd_r=BA893M33D8Q2NR9FRXMH&pd_rd_wg=hvS9Q&pd_rd_r=534cc386-ca63-4d36-88d8-1bf0062a31b8",
  "https://www.amazon.com/Nitoms-STALOGY-365-Day-Notebook/dp/B0777FHBL5?pd_rd_w=rjiZA&content-id=amzn1.sym.393b97ff-a095-4874-b1c4-ba61ec323005&pf_rd_p=393b97ff-a095-4874-b1c4-ba61ec323005&pf_rd_r=MSV2XT3BA5F0MB94XE1Z&pd_rd_wg=RBPHY&pd_rd_r=7a618869-cff1-4af6-8a64-55f38519c15a&pd_rd_i=B0777FHBL5&psc=1&ref_=pd_bap_d_grid_rp_0_3_t",
  "https://www.redfin.com/IL/Skokie/9003-Lavergne-Ave-60077/home/13619524",
];

// IDEA: the conditions in which are used. Let me create a util function for each of them
// IDEA: I need fallback texts or images

const Bookmarks = () => {
  const [previews, setPreviews] = useState([]);

  const fetchPreviews = async () => {
    try {
      // FIX: need to find how I can retrieve the port of the local server
      const response = await fetch(`http://localhost:3007/api/previews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });

      const data = await response.json();

      setPreviews(data);

      // FIX
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchPreviews();
  }, []);

  return (
    <div className="bookmarks">
      {previews.map((preview, idx) => {
        if (preview.error) {
          return (
            <div key={`somethingwentwrong-${idx}`} className="bookmark">
              <h1>There has been an error</h1>
            </div>
          );
        }

        const { metadata } = preview;

        return (
          <div key={`somethingwentright-${idx}`} className="bookmark">
            <div className="metadata-container">
              <h6>URL to spend to: </h6>
              <p>{preview.url}</p>
            </div>

            <div className="metadata-container">
              <h6>Title: </h6>
              <p>
                {metadata?.open_graph?.title ||
                  metadata?.title ||
                  "there is no title"}
              </p>
            </div>

            <div className="metadata-container">
              <h6> Description: </h6>
              <p>
                {metadata?.open_graph?.description ||
                  metadata?.description ||
                  "No Description"}
              </p>
            </div>

            <div className="metadata-container">
              <h6>Sitename: </h6>
              <p>
                {metadata?.open_graph?.site_name ||
                  metadata?.title ||
                  preview.url ||
                  "there is no site name"}
              </p>
            </div>

            <div className="image-container">
              <h6>Favicon: </h6>
              <img className="favicon" src={metadata?.favicon} />
            </div>

            <div className="image-container">
              <h6>Thumbnail: </h6>
              <img
                className="thumbnail"
                src={metadata?.open_graph?.images[0].url}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Bookmarks;
