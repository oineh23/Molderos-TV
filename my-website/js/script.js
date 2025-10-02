‎let jwPlayerInstance = null,
‎  activeIndex = -1
‎const channels = [
‎    {
‎        name: 'KAPAMILYA CHANNEL',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-faws.akamaized.net/out/v1/efa01372657648be830e7c23ff68bea2/index.mpd'
‎    },
‎    {
‎        name: 'GMA',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://fetch.kalibonco.workers.dev/gma/stream/stream.m3u8'
‎    },
‎    {
‎        name: 'GMA PINOY TV',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://amg01006-abs-cbn-abscbn-gma-x7-dash-abscbnono-dzsx9.amagi.tv/index.mpd',
‎        drm: {
‎            clearkey: {keyId: 'c95ed4c44b0b4f7fa1c6ebbbbaab21a1',key: '47635b8e885e19f2ccbdff078c207058'}
‎        }
‎    },
‎    {
‎        name: 'TV5',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/tv5_hd.mpd',
‎        drm: {
‎            clearkey: {keyId: '2615129ef2c846a9bbd43a641c7303ef',key: '07c7f996b1734ea288641a68e1cfdc4d'}
‎        }
‎    },
‎    {
‎        name: 'ONE SPORTS',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/cg_onesports_hd.mpd',
‎        drm: {
‎            clearkey: {keyId: '53c3bf2eba574f639aa21f2d4409ff11',key: '3de28411cf08a64ea935b9578f6d0edd'}
‎        }
‎    },
‎    {
‎        name: 'PTV',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/cg_ptv4_sd.mpd',
‎        drm: {
‎            clearkey: {keyId: '71a130a851b9484bb47141c8966fb4a3',key: 'ad1f003b4f0b31b75ea4593844435600'}
‎        }
‎    },
‎    {
‎        name: 'IBC 13',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/ibc13_sd_new.mpd',
‎        drm: {
‎            clearkey: {keyId: '16ecd238c0394592b8d3559c06b1faf5',key: '05b47ae3be1368912ebe28f87480fc84'}
‎        }
‎    },
‎    {
‎        name: 'A2Z',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/cg_a2z.mpd',
‎        drm: {
‎            clearkey: {keyId: 'f703e4c8ec9041eeb5028ab4248fa094',key: 'c22f2162e176eee6273a5d0b68d19530'}
‎        }
‎    },
‎    {
‎        name: 'RPTV',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cnn_rptv_prod_hd.mpd',
‎        drm: {
‎            clearkey: {keyId: '1917f4caf2364e6d9b1507326a85ead6',key: 'a1340a251a5aa63a9b0ea5d9d7f67595'}
‎        }
‎    },
‎    {
‎        name: 'ANC HD',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-faws.akamaized.net/out/v1/89ea8db23cb24a91bfa5d0795f8d759e/index.mpd',
‎        drm: {
‎            clearkey: {keyId: '4bbdc78024a54662854b412d01fafa16',key: '6039ec9b213aca913821677a28bd78ae'}
‎        }
‎    },
‎    {
‎        name: 'DZMM TELERADYO',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://d14c00opfjb50c.cloudfront.net/out/v1/0fa4eb67579d41cca4ed146c93aa855f/index.mpd',
‎        drm: {
‎            clearkey: {keyId: '47c093e0c9fd4f80839a0337da3dd876',key: '50547394045b3d047dc7d92f57b5fb33'}
‎        }
‎    },
‎    {
‎        name: 'BILYONARYO',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-05-prod.akamaized.net/out/u/bilyonaryoch.mpd',
‎        drm: {
‎            clearkey: {keyId: '227ffaf09bec4a889e0e0988704d52a2',key: 'b2d0dce5c486891997c1c92ddaca2cd2'}
‎        }
‎    },
‎    {
‎        name: 'DWAR ABANTE RADYO',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://amg19223-amg19223c12-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c12-amgplt0352/playlist.m3u8'
‎    },
‎    {
‎        name: 'ONE NEWS',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/onenews_hd1.mpd',
‎        drm: {
‎            clearkey: {keyId: 'd39eb201ae494a0b98583df4d110e8dd',key: '6797066880d344422abd3f5eda41f45f'}
‎        }
‎    },
‎    {
‎        name: 'ONE PH',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/oneph_sd.mpd',
‎        drm: {
‎            clearkey: {keyId: '92834ab4a7e1499b90886c5d49220e46',key: 'a7108d9a6cfcc1b7939eb111daf09ab3'}
‎        }
‎    },
‎    {
‎        name: 'TRUE FM TV',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-08-prod.akamaized.net/out/u/truefm_tv.mpd',
‎        drm: {
‎            clearkey: {keyId: '0559c95496d44fadb94105b9176c3579',key: '40d8bb2a46ffd03540e0c6210ece57ce'}
‎        }
‎    },
‎    {
‎        name: 'KNOWLEDGE CHANNEL',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_knowledgechannel.mpd',
‎        drm: {
‎            clearkey: {keyId: '0f856fa0412b11edb8780242ac120002',key: '783374273ef97ad3bc992c1d63e091e7'}
‎        }
‎    },
‎    {
‎        name: 'TVUP',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/tvup_prd.mpd',
‎        drm: {
‎            clearkey: {keyId: '83e813ccd4ca4837afd611037af02f63',key: 'a97c515dbcb5dcbc432bbd09d15afd41'}
‎        }
‎    },
‎    {
‎        name: 'DREAMWORKS (TAG)',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/cg_dreamworktag.mpd',
‎        drm: {
‎            clearkey: {keyId: '564b3b1c781043c19242c66e348699c5',key: 'd3ad27d7fe1f14fb1a2cd5688549fbab'}
‎        }
‎    },
‎    {
‎        name: 'MINDANOW NETWORK',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://streams1.comclark.com/overlay/mindanow/playlist.m3u8'
‎    },
‎    {
‎        name: 'TV MARIA',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/tvmaria_prd.mpd',
‎        drm: {
‎            clearkey: {keyId: 'fa3998b9a4de40659725ebc5151250d6',key: '998f1294b122bbf1a96c1ddc0cbb229f'}
‎        }
‎    },
‎    {
‎        name: 'ONE SPORTS +',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_onesportsplus_hd1.mpd',
‎        drm: {
‎            clearkey: {keyId: '322d06e9326f4753a7ec0908030c13d8',key: '1e3e0ca32d421fbfec86feced0efefda'}
‎        }
‎    },
‎    {
‎        name: 'PBA RUSH',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_pbarush_hd1.mpd',
‎        drm: {
‎            clearkey: {keyId: '95588338ee37423e99358a6d431324b9',key: '6e0f50a12f36599a55073868f814e81e'}
‎        }
‎    },
‎    {
‎        name: 'UAAP VARSITY',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-10-prod.akamaized.net/out/u/cg_uaap_cplay_sd.mpd',
‎        drm: {
‎            clearkey: {keyId: '95588338ee37423e99358a6d431324b9',key: '6e0f50a12f36599a55073868f814e81e'}
‎        }
‎    },
‎    {
‎        name: 'CINEMA ONE',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://live-faws.akamaized.net/out/v1/93b9db7b231d45f28f64f29b86dc6c65/index.mpd'
‎    },
‎    {
‎        name: 'CINE MO!',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://live-faws.akamaized.net/out/v1/3a895f368f4a467c9bca0962559efc19/index.mpd'
‎    },
‎    {
‎        name: 'JEEPNEY TV',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://abslive.akamaized.net/dash/live/2028025/jeepneytv/manifest.mpd',
‎        drm: {
‎            clearkey: {keyId: '90ea4079e02f418db7b170e8763e65f0',key: '1bfe2d166e31d03eee86ee568bd6c272'}
‎        }
‎    },
‎    {
‎        name: 'PBO',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/pbo_sd.mpd',
‎        drm: {
‎            clearkey: {keyId: 'dcbdaaa6662d4188bdf97f9f0ca5e830',key: '31e752b441bd2972f2b98a4b1bc1c7a1'}
‎        }
‎    },
‎    {
‎        name: 'VIVA CINEMA',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/viva_sd.mpd',
‎        drm: {
‎            clearkey: {keyId: '07aa813bf2c147748046edd930f7736e',key: '3bd6688b8b44e96201e753224adfc8fb'}
‎        }
‎    },
‎    {
‎        name: 'SARI-SARI',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_sari_sari_sd.mpd',
‎        drm: {
‎            clearkey: {keyId: '0a7ab3612f434335aa6e895016d8cd2d',key: 'b21654621230ae21714a5cab52daeb9d'}
‎        }
‎    },
‎    {
‎        name: 'BUKO',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_buko_sd.mpd',
‎        drm: {
‎            clearkey: {keyId: 'd273c085f2ab4a248e7bfc375229007d',key: '7932354c3a84f7fc1b80efa6bcea0615'}
‎        }
‎    },
‎    {
‎        name: 'TMC',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/cg_tagalogmovie.mpd',
‎        drm: {
‎            clearkey: {keyId: '96701d297d1241e492d41c397631d857',key: 'ca2931211c1a261f082a3a2c4fd9f91b'}
‎        }
‎    },
‎    {
‎        name: 'CELESTIAL MOVIES PINOY',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/celmovie_pinoy_sd.mpd',
‎        drm: {
‎            clearkey: {keyId: '0f8537d8412b11edb8780242ac120002',key: '2ffd7230416150fd5196fd7ea71c36f3'}
‎        }
‎    },
‎    {
‎        name: 'TVN MOVIES PINOY',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/cg_tvnmovie.mpd',
‎        drm: {
‎            clearkey: {keyId: '2e53f8d8a5e94bca8f9a1e16ce67df33',key: '3471b2464b5c7b033a03bb8307d9fa35'}
‎        }
‎    },
‎    {
‎        name: 'ZEE SINE',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://amg17931-zee-amg17931c9-samsung-ph-6528.playouts.now.amagi.tv/playlist/amg17931-asiatvusaltdfast-zeesine-samsungph/playlist.m3u8'
‎    },
‎    {
‎        name: 'JUNGO PINOY TV',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://jungotvstream.chanall.tv/jungotv/jungopinoytv/stream.m3u8'
‎    },
‎    {
‎        name: 'HALLYPOP',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://jungotvstream.chanall.tv/jungotv/hallypop/stream.m3u8'
‎    },
‎    {
‎        name: 'FRONT ROW CHANNEL',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://jungotvstream.chanall.tv/jungotv/frontrow/stream.m3u8'
‎    },
‎    {
‎        name: 'SCREAMFLIX',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://jungotvstream.chanall.tv/jungotv/screamflix/stream.m3u8'
‎    },
‎    {
‎        name: 'AWSN',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://amg02188-amg02188c2-jungotv-northamerica-5717.playouts.now.amagi.tv/playlist1080p.m3u8'
‎    },
‎    {
‎        name: 'COMBATGO',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://jungotvstream.chanall.tv/jungotv/combatgo/stream.m3u8'
‎    },
‎    {
‎        name: 'CNN',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-12-prod.akamaized.net/out/u/dr_cnnhd.mpd',
‎        drm: {
‎            clearkey: {keyId: '900c43f0e02742dd854148b7a75abbec',key: 'da315cca7f2902b4de23199718ed7e90'}
‎        }
‎    },
‎    {
‎        name: 'BLOOMBERG',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://www.bloomberg.com/media-manifest/streams/asia.m3u8'
‎    },
‎    {
‎        name: 'RUSSIA TODAY',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://1a-1791.com/live/hr6yv36f/slot-4/mxtm-wdfe_360p/chunklist_DVR.m3u8'
‎    },
‎    {
‎        name: 'DW',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8'
‎    },
‎    {
‎        name: 'BBC NEWS',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://d2vnbkvjbims7j.cloudfront.net/containerA/LTN/playlist.m3u8'
‎    },
‎    {
‎        name: 'EURONEWS',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://amg00882-amg00882c2-samsung-ph-4542.playouts.now.amagi.tv/playlist.m3u8'
‎    },
‎    {
‎        name: 'CNBC',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://linearjitp-playback.astro.com.my/dash-wv/linear/900/default_ott.mpd',
‎        drm: {
‎            clearkey: {keyId: 'c3a38f1340531759a1ca97bc5d80c810',key: '602827a870d49862d1a23f2912957b4c'}
‎        }
‎    },
‎    {
‎        name: 'AL JAZEERA',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://linearjitp-playback.astro.com.my/dash-wv/linear/2110/default_ott.mpd',
‎        drm: {
‎            clearkey: {keyId: 'b1fbd0874e7923f5b05929a042aa0610',key: '6c3c498113abffdf454dc935319a794d'}
‎        }
‎    },
‎    {
‎        name: 'SKY NEWS',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://linear417-gb-hls1-prd-ak.cdn.skycdp.com/100e/Content/HLS_001_1080_30/Live/channel(skynews)/index_1080-30.m3u8'
‎    },
‎    {
‎        name: 'WION',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://d7x8z4yuq42qn.cloudfront.net/index_7.m3u8'
‎    },
‎    {
‎        name: 'CNA',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://linearjitp-playback.astro.com.my/dash-wv/linear/605/default_ott.mpd',
‎        drm: {
‎            clearkey: {keyId: 'f812aeae6be5b924a8181b512d5d7910',key: '44275884ee394d05081fde395ff6e415'}
‎        }
‎    },
‎    {
‎        name: 'FRANCE 24',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://a-cdn.klowdtv.com/live2/france24_720p/chunks.m3u8'
‎    },
‎    {
‎        name: 'TRT WORLD',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://tv-trtworld.medya.trt.com.tr/master.m3u8'
‎    },
‎    {
‎        name: 'CGTN',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://amg00405-rakutentv-cgtn-rakuten-i9tar.amagi.tv/master.m3u8'
‎    },
‎    {
‎        name: 'PHOENIX INFONEWS',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://linearjitp-playback.astro.com.my/dash-wv/linear/5009/default_ott.mpd',
‎        drm: {
‎            clearkey: {keyId: '9729558a9bff8d94774bfa2f019a1310',key: '8b9eb7ab7196a425d9ab618a5c9f99d9'}
‎        }
‎    },
‎    {
‎        name: 'HBO',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_hbohd.mpd',
‎        drm: {
‎            clearkey: {keyId: 'd47ebabf7a21430b83a8c4b82d9ef6b1',key: '54c213b2b5f885f1e0290ee4131d425b'}
‎        }
‎    },
‎    {
‎        name: 'CINEMAX',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_cinemax.mpd',
‎        drm: {
‎            clearkey: {keyId: 'b207c44332844523a3a3b0469e5652d7',key: 'fe71aea346db08f8c6fbf0592209f955'}
‎        }
‎    },
‎    {
‎        name: 'HBO HITS',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/cg_hbohits.mpd',
‎        drm: {
‎            clearkey: {keyId: 'b04ae8017b5b4601a5a0c9060f6d5b7d',key: 'a8795f3bdb8a4778b7e888ee484cc7a1'}
‎        }
‎    },
‎    {
‎        name: 'HBO SIGNATURE',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_hbosign.mpd',
‎        drm: {
‎            clearkey: {keyId: 'a06ca6c275744151895762e0346380f5',key: '559da1b63eec77b5a942018f14d3f56f'}
‎        }
‎    },
‎    {
‎        name: 'HBO FAMILY',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_hbofam.mpd',
‎        drm: {
‎            clearkey: {keyId: '872910c843294319800d85f9a0940607',key: 'f79fd895b79c590708cf5e8b5c6263be'}
‎        }
‎    },
‎    {
‎        name: 'HBO PLUS',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/5/out/u/dash/HBOPLUSHD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: '861ab989089891d84ad0da296954437c',key: '3bdf94f9fc1888529f8d27d070d38566'}
‎        }
‎    },
‎    {
‎        name: 'HBO 2',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/5/out/u/dash/HBO2HD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: '09e84fc7ecb71def143cd7e2771f3b35',key: '1a91f2d315fb0593321ba60aa783ec2c'}
‎        }
‎    },
‎    {
‎        name: 'HBO XTREME',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/5/out/u/dash/HBOXTREMEHD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: 'bc8d4369fcff86db765db82356b4797c',key: '8a7e801dbc275e3f4e1f43cba648906a'}
‎        }
‎    },
‎    {
‎        name: 'HBO POP',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/5/out/u/dash/HBOPOPHD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: 'bcf36f412fa3d735cea04f7443fbf77c',key: '6ff29fb2d6b7d825eb06004650a0a4ea'}
‎        }
‎    },
‎    {
‎        name: 'HBO MUNDI',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/5/out/u/dash/HBOMUNDIHD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: 'ba4052ca5eb6f8ff6b98d47d098b2dec',key: 'bb3e4bfa1821d2bdc25c9a0970e4e3b8'}
‎        }
‎    },
‎    {
‎        name: 'CINEMAX 2',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://dash2.antik.sk/stream/hisi_cinemax_2/playlist_cbcs.mpd',
‎        drm: {
‎            clearkey: {keyId: '11223344556677889900112233445566',key: '4b80724d0ef86bcb2c21f7999d67739d'}
‎        }
‎    },
‎    {
‎        name: 'HBO 3',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://dash2.antik.sk/stream/hisi_hbo_3/playlist_cbcs.mpd',
‎        drm: {
‎            clearkey: {keyId: '11223344556677889900112233445566',key: '4b80724d0ef86bcb2c21f7999d67739d'}
‎        }
‎    },
‎    {
‎        name: 'HBO COMEDY',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://ottb.live.cf.ww.aiv-cdn.net/pdx-nitro/live/clients/dash/enc/ejmisemcpz/out/v1/9e10d2bc67434f7d95911c3e695ce087/cenc.mpd',
‎        drm: {
‎            clearkey: {keyId: '217624a3983b3593ca7d1f3b01042d4f',key: 'fecaa3486d9deef3f7f0e1a95b662cb7'}
‎        }
‎    },
‎    {
‎        name: 'UNIVERSAL TV',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/4/out/u/dash/UNIVERSALCHANNELHD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: '840bcd9ffdd5721c40b0ade4d9b68246',key: 'd19d330de1f428d1902bc1629a65c0bf'}
‎        }
‎    },
‎    {
‎        name: '13TH STREET',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://ott.udptv.xyz/stream/skyde/13thstreet/master.m3u8?u=cocked&p=dd0abb52723d22acc0f97fe0336480feaa88a37ecda55a138a8d5e0ee14b0664'
‎    },
‎    {
‎        name: 'USA NETWORK',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://otte.live.cf.ww.aiv-cdn.net/gru-nitro/live/clients/dash/enc/1hz9ifohl2/out/v1/ac9abc088bfa42d49218644005535e02/cenc.mpd',
‎        drm: {
‎            clearkey: {keyId: 'bc9f3a3f7ce7922c3b599e2e0c1f7830',key: '4591bf63837b4b342058c5e11a51744a'}
‎        }
‎    },
‎    {
‎        name: 'UNIVERSAL PREMIERE',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/2/out/u/dash/UNIVERSALPREMIEREHD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: '9ccd5dd0c86a40ed719b83e1801bcd88',key: '6d5e62525837ba9b7e09cfb8716116ba'}
‎        }
‎    },
‎    {
‎        name: 'UNIVERSAL CINEMA',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/2/out/u/dash/UNIVERSALCINEMAHD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: '44a9e6477651b3b47f3a2b727d562835',key: '1b87070d9fad5dee0a35ff014a2063a7'}
‎        }
‎    },
‎    {
‎        name: 'UNIVERSAL REALITY',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/2/out/u/dash/UNIVERSALREALITYHD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: '02a02bce7a3c518386e0da4e5ec0188d',key: '071c7cc4c2f33e1e2d3fa3807d1bbbcc'}
‎        }
‎    },
‎    {
‎        name: 'UNIVERSAL COMEDY',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/2/out/u/dash/UNIVERSALCOMEDYHD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: '92b162b0b1d0dbb1e401f5845b4ce109',key: '83b7ae276784a7f78f4a0c1190974d5c'}
‎        }
‎    },
‎    {
‎        name: 'UNIVERSAL CRIME',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/2/out/u/dash/UNIVERSALCRIMEHD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: '3a908a5d38a9c496ced27faa6bf5ff8e',key: '85a5835a92bd7f87faf5ffbcb8814d33'}
‎        }
‎    },
‎    {
‎        name: 'KIX',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/kix_hd1.mpd',
‎        drm: {
‎            clearkey: {keyId: 'a8d5712967cd495ca80fdc425bc61d6b',key: 'f248c29525ed4c40cc39baeee9634735'}
‎        }
‎    },
‎    {
‎        name: 'THRILL',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_thrill_sd.mpd',
‎        drm: {
‎            clearkey: {keyId: '928114ffb2394d14b5585258f70ed183',key: 'a82edc340bc73447bac16cdfed0a4c62'}
‎        }
‎    },
‎    {
‎        name: 'AXN',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://linearjitp-playback.astro.com.my/dash-wv/linear/2303/default_ott.mpd',
‎        drm: {
‎            clearkey: {keyId: 'c24a7811d9ab46b48b746a0e7e269210',key: 'c321afe1689b07d5b7e55bd025c483ce'}
‎        }
‎    },
‎    {
‎        name: 'ROCK ENTERTAINMENT',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_rockentertainment.mpd',
‎        drm: {
‎            clearkey: {keyId: 'e4ee0cf8ca9746f99af402ca6eed8dc7',key: 'be2a096403346bc1d0bb0f812822bb62'}
‎        }
‎    },
‎    {
‎        name: 'ROCK ACTION',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_rockextreme.mpd',
‎        drm: {
‎            clearkey: {keyId: '0f852fb8412b11edb8780242ac120002',key: '4cbc004d8c444f9f996db42059ce8178'}
‎        }
‎    },
‎    {
‎        name: 'HITS',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/hits_hd1.mpd',
‎        drm: {
‎            clearkey: {keyId: 'dac605bc197e442c93f4f08595a95100',key: '975e27ffc1b7949721ee3ccb4b7fd3e5'}
‎        }
‎    },
‎    {
‎        name: 'HITS MOVIES',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://linearjitp-playback.astro.com.my/dash-wv/linear/2305/default_ott.mpd',
‎        drm: {
‎            clearkey: {keyId: 'ff1febd7018d0dd711601e795e0d6210',key: '38fbfb3a56e40ff92c9df8acbcba9ef6'}
‎        }
‎    },
‎    {
‎        name: 'HITS NOW',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://linearjitp-playback.astro.com.my/dash-wv/linear/5110/default_ott.mpd',
‎        drm: {
‎            clearkey: {keyId: '4307def6a29bec082f8c93f1f98e5910',key: 'a4d49bda8cd29ba2888c732b4e7d9d63'}
‎        }
‎    },
‎    {
‎        name: 'PARAMOUNT',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/2/out/u/dash/PARAMOUNTHD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: '90cc957ead3f42e98b46d14e8c4b08de',key: '3ab7cff1e63b9efc40aa962023b4b6b8'}
‎        }
‎    },
‎    {
‎        name: 'COMEDY CENTRAL',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-atv-cdn.izzigo.tv/2/out/u/dash/COMEDYCENTRALHD/default.mpd',
‎        drm: {
‎            clearkey: {keyId: '2a61b7a7912064acc62a06a6ae22ac5c',key: '5bfb374d644703550f0637532bca0491'}
‎        }
‎    },
‎    {
‎        name: 'AMC',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://cors.jugorder.de/https://tr.live.cdn.cgates.lt/live/dash/560908/index.mpd',
‎        drm: {
‎            clearkey: {keyId: '34c1715a9fd24e7d8497da043669ad66',key: 'e3ce21758f33b38413d7cfecfddcb289'}
‎        }
‎    },
‎    {
‎        name: 'TAP TV',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_taptv_sd.mpd',
‎        drm: {
‎            clearkey: {keyId: 'f6804251e90b4966889b7df94fdc621e',key: '55c3c014f2bd12d6bd62349658f24566'}
‎        }
‎    },
‎    {
‎        name: 'TAP MOVIES',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_tapmovies_hd1.mpd',
‎        drm: {
‎            clearkey: {keyId: '71cbdf02b595468bb77398222e1ade09',key: 'c3f2aa420b8908ab8761571c01899460'}
‎        }
‎    },
‎    {
‎        name: 'TAP ACTION FLIX',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_tapactionflix_hd1.mpd',
‎        drm: {
‎            clearkey: {keyId: 'bee1066160c0424696d9bf99ca0645e3',key: 'f5b72bf3b89b9848de5616f37de040b7'}
‎        }
‎    },
‎    {
‎        name: 'WARNER TV',
‎        category: 'All Channels',
‎        type: 'hls',
‎        url: 'https://cdn4.skygo.mn/live/disk1/Warner/HLSv3-FTA/Warner.m3u8'
‎    },
‎    {
‎        name: 'ADULT SWIM',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://lott-web-opus.cdn.avp.telus.net/232006004039/vxfmt=dp/manifest.mpd?device_profile=dashvmx',
‎        drm: {
‎            clearkey: {keyId: '11111111111111118111000000000000',key: '9739a3252d6862add482841c1445fee0'}
‎        }
‎    },
‎    {
‎        name: 'MOVIES NOW',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://times-ott-live.akamaized.net/moviesnow_wv_drm/index.mpd',
‎        drm: {
‎            clearkey: {keyId: '40f019b86241d23ef075633fd7f1e927',key: '058dec845bd340178a388edd104a015e'}
‎        }
‎    },
‎    {
‎        name: 'MNX',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://times-ott-live.akamaized.net/mnxhd_wv_drm/index.mpd',
‎        drm: {
‎            clearkey: {keyId: '40f019b86241d23ef075633fd7f1e927',key: '058dec845bd340178a388edd104a015e'}
‎        }
‎    },
‎    {
‎        name: 'MN+',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://times-ott-live.akamaized.net/mnplus_wv_drm/index.mpd',
‎        drm: {
‎            clearkey: {keyId: '40f019b86241d23ef075633fd7f1e927',key: '058dec845bd340178a388edd104a015e'}
‎        }
‎    },
‎    {
‎        name: 'ROMEDY NOW',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://times-ott-live.akamaized.net/romedynow_wv_drm/index.mpd',
‎        drm: {
‎            clearkey: {keyId: '40f019b86241d23ef075633fd7f1e927',key: '058dec845bd340178a388edd104a015e'}
‎        }
‎    },
‎    {
‎        name: 'CRAVE 1',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-crave.video.9c9media.com/137c6e2e72e1bf67b82614c7c9b216d6f3a8c8281748505659713/fe/f/crave/crave1/manifest.mpd',
‎        drm: {
‎            clearkey: {keyId: '4a107945066f45a9af2c32ea88be60f4',key: 'df97e849d68479ec16e395feda7627d0'}
‎        }
‎    },
‎    {
‎        name: 'CRAVE 2',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-crave.video.9c9media.com/ab4332c60e19b6629129eeb38a2a6ac6db5df2571721750022187/fe/f/crave/crave2/manifest.mpd',
‎        drm: {
‎            clearkey: {keyId: '4ac6eaaf0e5e4f94987cbb5b243b54e8',key: '8bb3f2f421f6afd025fa46c784944ad6'}
‎        }
‎    },
‎    {
‎        name: 'CRAVE 3',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-crave.video.9c9media.com/58def7d65f59ffaf995238981dd0e276d5a8fe8d1748593014588/fe/f/crave/crave3/manifest.mpd',
‎        drm: {
‎            clearkey: {keyId: 'eac7cd7979f04288bc335fc1d88fa344',key: '0fca71cf91b3c4931ad3cf66c631c24c'}
‎        }
‎    },
‎    {
‎        name: 'CRAVE 4',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://live-crave.video.9c9media.com/c5875a31f178e038f7cc572b1aa0defb996ce7171748593186018/fe/f/crave/crave4/manifest.mpd',
‎        drm: {
‎            clearkey: {keyId: 'a7242a7026ff45609114ee1f3beb34dc',key: '65c32ada65548203a3683d5d37dd3a06'}
‎        }
‎    },
‎    {
‎        name: 'ASTRO SHOWCASE',
‎        category: 'All Channels',
‎        type: 'mpd',
‎        url: 'https://linearjitp-playback.astro.com.my/dash-wv/linear/5054/default_ott.mpd',
‎        drm: {
‎            clearkey: {keyId: 'b8090c8361cc5cc5c1aac0ec2710de10',key: 'ca0d18538845bae2