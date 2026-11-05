// ═══════════════════════════════════════════════════════════
// SPOTIFY EMBED — official Spotify embed iframe + IFrame API
//
// This module only hands Mirthic a reference to Spotify's own
// embed player and uses the IFrame API to report playback state
// (play/pause/position) back to the app. It never intercepts,
// extracts, or caches audio.
//
// The IFrame API is described at:
//   https://developer.spotify.com/documentation/embeds/iframe-api
//
// ═══════════════════════════════════════════════════════════

export interface EmbedPlaybackState {
  isPaused: boolean;
  position: number; // ms
  duration: number;   // ms
}

export interface SpotifyEmbeddable {
  readonly uri: string;            // spotify:track:… or spotify:playlist:…
  readonly type: 'track' | 'playlist' | 'album';
}

export interface SpotifyEmbedController {
  /**
   * Mount the official embed iframe into a container element.
   * Returns a function to clean up the controller.
   */
  mount(container: HTMLElement, embed: SpotifyEmbeddable): void;
  destroy(): void;
  loadUri(uri: string): void;
  play(): void;
  pause(): void;
  togglePlay(): void;
  seek(positionMs: number): void;
  getState(): EmbedPlaybackState | null;
  onStateUpdate(listener: (state: EmbedPlaybackState) => void): void;
}

/**
 * Create an embed controller backed only by Spotify's official IFrame API.
 * The controller does NOT itself fetch or play audio; it asks Spotify's iframe
 * to do that.
 */
export function createSpotifyEmbedController(): SpotifyEmbedController {
  let iframe: HTMLIFrameElement | null = null;
  let container: HTMLElement | null = null;
  let iface: SpotifyIFrameAPI | null = null;
  let controller: SpotifyController | null = null;
  let listener: ((state: EmbedPlaybackState) => void) | null = null;
  let uri: string = '';

  function currentUri(): string {
    return uri;
  }

  function mount(containerEl: HTMLElement, embed: SpotifyEmbeddable): void {
    if (iframe) destroy();
    container = containerEl;
    uri = embed.uri;

    const sandboxAttrs = 'allow-scripts allow-same-origin';
    iframe = document.createElement('iframe');
    iframe.src = `https://open.spotify.com/embed/${embed.type}/${embed.uri.replace(/^spotify:\/?/, '')}`;
    iframe.title = `Now playing: ${embed.type} on Spotify`;
    iframe.className = '';
    iframe.setAttribute('sandbox', sandboxAttrs);
    iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen; picture-in-picture');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.style.borderRadius = '8px';
    iframe.style.background = '#121212';

    containerEl.appendChild(iframe);

    // The official IFrame API is made available once the iframe has loaded.
    window.onSpotifyIframeApiReady?.(async (api: SpotifyIFrameAPI) => {
      iface = api;
      try {
        controller = await api.createController(containerEl, {
          uri: embed.uri,
          width: 400,
          height: 400,
          backgroundColor: '#121212',
        });
        iframe = null; // controller owns the DOM now
        iframe = null;
        if (controller) {
          controller.on('playback_update', (state: { isPaused?: boolean; position?: number; duration?: number }) => {
            if (listener) {
              listener({
                isPaused: state.isPaused ?? true,
                position: state.position ?? 0,
                duration: state.duration ?? 0,
              });
            }
          });
        }
      } catch (e) {
        console.warn('[SpotifyEmbed] IFrame API error:', e);
        iface = null;
      }
    });
  }

  function destroy(): void {
    if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
    iframe = null;
    if (container) container.innerHTML = '';
    container = null;
    iface = null;
    controller = null;
    listener = null;
    uri = '';
  }

  function loadUri(newUri: string): void {
    uri = newUri;
    if (controller) {
      try { controller.loadUri(newUri); } catch { /* ignore */ }
    }
  }

  function play(): void {
    if (controller) {
      try { controller.play(); } catch { /* ignore */ }
    }
  }

  function pause(): void {
    if (controller) {
      try { controller.pause(); } catch { /* ignore */ }
    }
  }

  function togglePlay(): void {
    if (controller) {
      try { controller.togglePlay(); } catch { /* ignore */ }
    }
  }

  function seek(positionMs: number): void {
    if (controller) {
      try { controller.seek(positionMs / 1000); } catch { /* ignore */ }
    }
  }

  function getState(): EmbedPlaybackState | null {
    if (controller) {
      try {
        const state = controller.getState();
        return {
          isPaused: state.isPaused ?? true,
          position: state.position ?? 0,
          duration: state.duration ?? 0,
        };
      } catch {
        return null;
      }
    }
    return null;
  }

  function onStateUpdate(cb: (state: EmbedPlaybackState) => void): void {
    listener = cb;
  }

  return {
    mount,
    destroy,
    loadUri,
    play,
    pause,
    togglePlay,
    seek,
    getState,
    onStateUpdate,
  };
}

// ─── TYPES (internal to this module) ──────────────────

interface SpotifyIFrameAPI {
  createController(
    container: HTMLElement,
    options: {
      uri?: string;
      width?: number;
      height?: number;
      backgroundColor?: string;
      playlistBackground?: string;
      theme?: string;
      }): Promise<SpotifyController>;
  }

interface SpotifyController {
  loadUri(uri: string): void;
  play(): void;
  pause(): void;
  togglePlay(): void;
  seek(position: number): void;
  getState(): EmbedPlaybackState;
  on(event: string, callback: (state: EmbedPlaybackState) => void): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (cb: (api: SpotifyIFrameAPI) => void) => void;
  }
}

