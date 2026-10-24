# Knihovny pro animace webu (stáhl Claude 24. 10. 2026 z npm)

| Knihovna (anglicky) | Česky – k čemu je | Verze | Licence |
|---|---|---|---|
| GSAP (GreenSock Animation Platform) | animace textů, obrázků a celých sekcí | 3.15.0 | GSAP Standard „No Charge“ License – zdarma i komerčně, https://gsap.com/standard-license |
| GSAP ScrollTrigger | animace spouštěné posouváním stránky | 3.15.0 | dtto |
| GSAP SplitText | rozložení nadpisu na písmena/slova a jejich „naskakování“ | 3.15.0 | dtto |
| GSAP ScrollSmoother, Flip, DrawSVG, MorphSVG, CustomEase, Observer, TextPlugin | plynulý scroll, přechody, kreslení a proměna loga, vlastní křivky pohybu | 3.15.0 | dtto |
| Lenis | plynulé posouvání stránky („drahý“ pocit) | 1.3.27 | MIT, soubor lenis/LICENSE.txt |

Vše je uložené místně ve složce `vendor/` – web nestahuje nic z cizích serverů.
React Bits je knihovna pro React; náš web je čisté HTML, proto se z ní berou jen nápady a efekty se staví přes GSAP (viz zadání PRÉMIOVÝ WEB).

## Doplnění W1–W3, 24. 10. 2026

| Název | Česky – k čemu je | Verze | Licence |
|---|---|---|---|
| Fraunces | místní nadpisové písmo; dvojice Manrope/Fraunces a Fraunces/Manrope | variabilní soubor Google Fonts, staženo 24. 10. 2026 | SIL Open Font License 1.1; `../assets/Fraunces-OFL.txt`; https://github.com/google/fonts/tree/main/ofl/fraunces |
| Lighthouse | pouze místní měření kvality, není načítán webem | 13.5.0 | Apache-2.0, licence v instalačním balíčku nástroje |
| axe-core / @axe-core/playwright | pouze místní audit přístupnosti | @axe-core/playwright 4.14.0 | MPL-2.0; licence v instalačním balíčku |
| chrome-launcher | pouze spuštění vlastního testovacího prohlížeče | 1.2.2 | Apache-2.0; licence v instalačním balíčku |
| Beautiful Soup | pouze místní sestavení HTML z původních textů | 4.15.0 | MIT, licence v `.qa-python/beautifulsoup4-4.15.0.dist-info/licenses/` |

Do stránky se načítají pouze GSAP, ScrollTrigger, Lenis a vlastní script.js: **139 215 bytů celkem, bez komprese**. Nepoužité GSAP pluginy se nenačítají. Three.js ani další runtime knihovna nebyly přidány. Efekty jsou vlastní, nebyl převzat kód React Bits. Znak je přímý WebP převod původního schváleného obrázku ze symbol.svg; nejde o nově generovaného jezevce.

Adresáře `.qa-python/` a `navrhy-premium/kontrola/tools/` jsou vývojové nástroje, nejsou součástí budoucího veřejného balíčku. Tento úkol žádný veřejný balíček ani nasazení nevytváří.
