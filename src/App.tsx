import { useEffect, useState, useRef } from "react";
import {
  AudioLines,
  Heart,
  Home,
  Library,
  ListMusic,
  MoreHorizontal,
  Play,
  Plus,
  Repeat2,
  Search,
  Settings,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

import "./App.css";

import {
  getTrackStreamUrl,
  getTrendingTracks,
  type AudiusTrack,
} from "./services/audius";

function App() {
  const [tracks, setTracks] = useState<AudiusTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [selectedTrack, setSelectedTrack] =
    useState<AudiusTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    getTrendingTracks()
      .then(setTracks)
      .catch((error) => {
        console.error(error);
        setApiError("Could not load tracks");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleTrackClick = async (track: AudiusTrack) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = 0.35;

    try {
      if (selectedTrack?.id === track.id) {
        if (audio.paused) {
          await audio.play();
        } else {
          audio.pause();
        }

        return;
      }

      setSelectedTrack(track);
      audio.src = getTrackStreamUrl(track.id);
      await audio.play();
    } catch (error) {
      console.error(error);
      setApiError("Could not play this track");
    }
  };
  
  return (
    <main className="app">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <aside className="navigation">
        <div className="brand-mark">M</div>

        <nav className="nav-items">
          <button className="nav-button active" aria-label="Home">
            <Home size={20} />
          </button>

          <button className="nav-button" aria-label="Library">
            <Library size={20} />
          </button>

          <button className="nav-button" aria-label="Favourites">
            <Heart size={20} />
          </button>

          <button className="nav-button" aria-label="Playlists">
            <ListMusic size={20} />
          </button>
        </nav>

        <button className="nav-button settings-button" aria-label="Settings">
          <Settings size={20} />
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="welcome-label">Make it sound alive</span>
            <h1>Discover</h1>
          </div>

          <div className="topbar-actions">
            <button className="search">
              <Search size={18} />
              <span>Search your music</span>
            </button>

            <button className="round-button" aria-label="More">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </header>

        <div className="dashboard">
          <section className="hero-card">
            <div className="hero-copy">
              <span className="hero-label">
                <AudioLines size={15} />
                Your personal sound
              </span>

              <h2>
                Let your music
                <br />
                fill the room.
              </h2>

              <p>
                Discover independent artists, new releases and sounds worth
                hearing.
              </p>

              <button className="import-button">
                <Plus size={18} />
                Explore music
              </button>
            </div>

            <div className="sound-object">
              <div className="sound-ring ring-one" />
              <div className="sound-ring ring-two" />
              <div className="sound-ring ring-three" />

              <div className="sound-core">
                <div className="core-mark">M</div>
              </div>
            </div>
          </section>

          <section className="collection">
            <div className="section-heading">
              <div>
                <span>Your collection</span>
                <h3>Recently added</h3>
              </div>

              <button>View all</button>
            </div>

            <div className="track-list">
              {isLoading && (
                <p className="tracks-status">Loading tracks...</p>
              )}

              {apiError && (
                <p className="tracks-status error">{apiError}</p>
              )}

              {!isLoading &&
                !apiError &&
                tracks.slice(0, 4).map((track) => (
                <button
                  className="track-card"
                  key={track.id}
                  onClick={() => handleTrackClick(track)}
                >
                  <Play
                    className="track-play-icon"
                    size={15}
                    fill="currentColor"
                  />
                
                  <div className="track-details">
                    <strong>{track.title}</strong>
                    <span>{track.user.name}</span>
                  </div>

                  <div className="track-artwork">
                    {track.artwork?.["150x150"] ? (
                      <img
                        src={track.artwork["150x150"]}
                        alt=""
                      />
                    ) : (
                      <AudioLines size={20} />
                    )}
                  </div>
                </button>
                ))}
            </div>
          </section>
        </div>
      </section>

      <footer className="player">
        <div className="current-track">
          <div className="cover-placeholder">
            <AudioLines size={22} />
          </div>

          <div className="track-copy">
            <strong>Nothing playing</strong>
            <span>Your music is waiting</span>
          </div>

          <button className="like-button" aria-label="Add to favourites">
            <Heart size={18} />
          </button>
        </div>

        <div className="playback">
          <div className="controls">
            <button aria-label="Shuffle">
              <Shuffle size={16} />
            </button>

            <button aria-label="Previous">
              <SkipBack size={19} />
            </button>

            <button className="play-button" aria-label="Play">
              <Play size={20} fill="currentColor" />
            </button>

            <button aria-label="Next">
              <SkipForward size={19} />
            </button>

            <button aria-label="Repeat">
              <Repeat2 size={16} />
            </button>
          </div>

          <div className="timeline">
            <span>0:00</span>
            <div className="timeline-track">
              <div className="timeline-progress" />
            </div>
            <span>0:00</span>
          </div>
        </div>

        <div className="volume">
          <Volume2 size={18} />
          <div className="volume-track">
            <div className="volume-level" />
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;