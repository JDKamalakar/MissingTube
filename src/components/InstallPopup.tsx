y: '0.3s' }}></div>
                <div className="absolute bottom-1/3 -left-4 w-2 h-2 bg-warning rounded-full animate-bounce opacity-60 transition-opacity duration-500" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -bottom-4 right-1/4 w-3 h-3 bg-tertiary rounded-full animate-bounce opacity-75 transition-opacity duration-500" style={{ animationDelay: '0.7s' }}></div>
                <div className="absolute top-1/2 -right-6 w-2 h-2 bg-warning rounded-full animate-bounce opacity-65 transition-opacity duration-500" style={{ animationDelay: '0.9s' }}></div>
                <div className="absolute -top-2 right-1/3 w-2 h-2 bg-tertiary rounded-full animate-bounce opacity-60 transition-opacity duration-500" style={{ animationDelay: '1.1s' }}></div>
              </>
            )}
          </div>

          <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-gray-300/30 dark:border-gray-700/30 transition-transform duration-200 hover:bg-white/20 hover:scale-[1.03]">
            <h2 className="text-2xl font-bold text-on-surface mb-2">
              Install MissingTube
            </h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Get the full MissingTube experience with our Progressive Web App.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl transition-all duration-200 hover:bg-white/20 hover:scale-[1.03]"
                >
                  <div className="p-2 bg-primary/20 rounded-xl">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-on-surface text-sm font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {isIOS && isSafari ? (
            <div className="text-center">
              <div className="bg-warning-container/20 border border-warning/30 rounded-2xl p-4 mb-4 transition-transform duration-200 hover:scale-[1.03]">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Share className="w-5 h-5 text-on-warning-container" />
                  <span className="font-semibold text-on-warning-container">iOS Safari Instructions</span>
                </div>
                <p className="text-sm text-on-warning-container">
                  1. Tap the <strong>Share</strong> button in Safari<br/>
                  2. Scroll down and select <strong>"Add to Home Screen"</strong><br/>
                  3. Tap <strong>"Add"</strong> to install
                </p>
              </div>
              <button
                onClick={handleDismissPermanently}
                className="group w-full py-3 bg-primary text-on-primary rounded-2xl font-semibold transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95"
              >
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 text-green-500 transition-transform duration-700 group-hover:rotate-[720deg]" />
                  Got it!
                </div>
              </button>
            </div>
          ) : installAvailable && currentDeferredPrompt ? (
            <div className="text-center">
              <div className="bg-primary-container/20 border border-primary/30 rounded-2xl p-4 mb-4 transition-transform duration-200 hover:scale-[1.03] relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Download className="w-5 h-5 text-on-primary-container" />
                  <span className="font-semibold text-on-primary-container">Install & Get App</span>
                </div>
                <p className="text-sm text-on-primary-container mb-4">
                  Install MissingTube as a native app for the best experience.
                </p>
                <button
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="relative w-full flex items-center justify-center gap-3 py-4 bg-primary text-on-primary rounded-2xl font-semibold transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  {isInstalling ? (
                    <>
                      <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                      Installing...
                    </>
                  ) : (
                    <>
                      {/* Animate download icon */}
                      <Download className="w-5 h-5 animate-bounce-subtle" /> 
                      Install App
                    </>
                  )}
                </button>
                {/* Flairs for the install button's parent div */}
                {showFlairs && (
                    <>
                        <div className="absolute -top-1 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-70 transition-opacity duration-500" style={{ animationDelay: '0.1s' }}></div>
                        <div className="absolute top-1/4 -right-1 w-2 h-2 bg-green-300 rounded-full animate-pulse opacity-60 transition-opacity duration-500" style={{ animationDelay: '0.3s' }}></div>
                        <div className="absolute bottom-1/2 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-80 transition-opacity duration-500" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute -bottom-1 right-1/3 w-2 h-2 bg-green-300 rounded-full animate-pulse opacity-75 transition-opacity duration-500" style={{ animationDelay: '0.7s' }}></div>
                        <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-65 transition-opacity duration-500" style={{ animationDelay: '0.9s' }}></div>
                    </>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="group flex-1 py-3 bg-white/10 text-on-surface rounded-2xl font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Hourglass className="w-5 h-5 text-on-surface/70 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-110" /> {/* Hourglass icon with hover animation */}
                    Maybe Later
                  </div>
                </button>
                <button
                  onClick={handleDismissPermanently}
                  className="group flex-1 py-3 bg-white/10 text-red-500 rounded-2xl font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center justify-center gap-2">
                    <X className="w-6 h-6 text-red-500 transition-transform duration-[2000ms] group-hover:rotate-[720deg]" />
                    No Thanks
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-secondary-container/20 border border-secondary/30 rounded-2xl p-4 mb-4 transition-transform duration-200 hover:scale-[1.03]">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DeviceIcon className="w-5 h-5 text-on-secondary-container" />
                  <span className="font-semibold text-on-secondary-container">Manual Installation</span>
                </div>
                <div className="text-sm text-on-secondary-container text-left space-y-2">
                  {isChrome && (
                    <p><strong>Chrome:</strong> Look for the install icon in the address bar, or go to Settings → Install MissingTube</p>
                  )}
                  {isEdge && (
                    <p><strong>Edge:</strong> Click the "..." menu → Apps → Install this site as an app</p>
                  )}
                  {!isChrome && !isEdge && (
                    <p>Look for an install option in your browser's menu, or bookmark this page for quick access.</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleClose}
                  className="group flex-1 py-3 bg-primary text-on-primary rounded-2xl font-semibold transition-all duration-200 hover:bg-primary/90 hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-green-500 transition-transform duration-2000ms group-hover:rotate-[720deg]" />
                    Got it!
                  </div>
                </button>
                <button
                  onClick={handleDismissPermanently}
                  className="group flex-1 py-3 bg-white/10 text-red-500 rounded-2xl font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center justify-center gap-2">
                    <X className="w-6 h-6 text-red-500 transition-transform duration-[2000ms] group-hover:rotate-[720deg]" />
                    No Thanks
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallPopup;