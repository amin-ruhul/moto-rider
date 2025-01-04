import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import StartGame from "./main";
import { EventBus, GameEvents } from "./EventBus";
import { useViewportSize } from "../hooks/useViewportSize";
import { buttonConfig } from "../config/button-config";
import { containerStyle } from "../config/container-config";

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
    function PhaserGame({ currentActiveScene }, ref) {
        const game = useRef<Phaser.Game | null>(null!);
        const { width, height } = useViewportSize(720);
        const [showButton, setShowButton] = useState(true);

        const handleStartGame = () => {
            setShowButton(false);
            game.current?.scene.start("Game");
            EventBus.emit(GameEvents.GAME_START);
        };

        // Initialize game
        useLayoutEffect(() => {
            if (game.current === null) {
                game.current = StartGame("game-container");

                if (typeof ref === "function") {
                    ref({ game: game.current, scene: null });
                } else if (ref) {
                    ref.current = { game: game.current, scene: null };
                }
            }

            return () => {
                if (game.current) {
                    game.current.destroy(true);
                    game.current = null;
                }
            };
        }, [ref]);

        // Handle scene ready event
        useEffect(() => {
            const handleSceneReady = (scene_instance: Phaser.Scene) => {
                if (
                    currentActiveScene &&
                    typeof currentActiveScene === "function"
                ) {
                    currentActiveScene(scene_instance);
                }

                if (typeof ref === "function") {
                    ref({ game: game.current, scene: scene_instance });
                } else if (ref) {
                    ref.current = {
                        game: game.current,
                        scene: scene_instance,
                    };
                }
            };

            EventBus.on("current-scene-ready", handleSceneReady);

            return () => {
                EventBus.removeListener("current-scene-ready");
            };
        }, [currentActiveScene, ref]);

        // Handle resize
        useEffect(() => {
            if (game.current) {
                game.current.scale.refresh();
            }
        }, [width, height]);

        // Handle game over
        useEffect(() => {
            const handleGameOver = () => {
                setShowButton(true);
            };

            EventBus.on(GameEvents.GAME_OVER, handleGameOver);

            return () => {
                EventBus.removeListener(GameEvents.GAME_OVER);
            };
        }, []);

        const buttonStyles = {
            ...buttonConfig.buttonStyle,
            position: "absolute",
            transform: "translate(-50%, -50%)",
            border: "none",
            cursor: "pointer",
        } as const;

        return (
            <div style={containerStyle}>
                <div id="game-container" />
                {showButton && (
                    <button style={buttonStyles} onClick={handleStartGame}>
                        {buttonConfig.buttonText}
                    </button>
                )}
            </div>
        );
    }
);

