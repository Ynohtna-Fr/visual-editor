<?php
/**
 * Serveur de preview simple pour Visual Editor
 *
 * Usage:
 * php -S localhost:8000 -t /chemin/vers/visual-editor-svelte
 *
 * Ensuite ouvrir: http://localhost:8000/examples/simple-html-example.html
 */

header('Content-Type: text/html; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Lire les données JSON envoyées
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['_name'])) {
    echo '<div style="padding: 2rem; background: #fee; color: #c00;">Erreur: Données invalides</div>';
    exit;
}

// Fonction helper pour échapper HTML
function e($text) {
    return htmlspecialchars($text ?? '', ENT_QUOTES, 'UTF-8');
}

// Rendu basé sur le type de composant
switch ($data['_name']) {
    case 'hero':
        renderHero($data);
        break;

    case 'button':
        renderButton($data);
        break;

    case 'features':
        renderFeatures($data);
        break;

    case 'testimonial':
        renderTestimonial($data);
        break;

    default:
        echo '<div style="padding: 2rem; background: #ffa; color: #860;">';
        echo 'Composant inconnu: ' . e($data['_name']);
        echo '</div>';
}

// ============================================================================
// Fonctions de rendu pour chaque composant
// ============================================================================

function renderHero($data) {
    $title = $data['title'] ?? '';
    $content = $data['content'] ?? '';
    $bgColor = $data['bgColor'] ?? '#ffffff';
    $centered = !empty($data['centered']);

    $textAlign = $centered ? 'center' : 'left';

    ?>
    <div class="hero" style="
        background-color: <?= e($bgColor) ?>;
        padding: 4rem 2rem;
        text-align: <?= $textAlign ?>;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    ">
        <div style="max-width: 800px; margin: 0 auto;">
            <?php if ($title): ?>
                <h1 style="margin: 0 0 1rem 0; font-size: 3rem; font-weight: bold;">
                    <?= e($title) ?>
                </h1>
            <?php endif; ?>

            <?php if ($content): ?>
                <div style="font-size: 1.25rem; line-height: 1.6;">
                    <?= $content ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

function renderButton($data) {
    $text = $data['text'] ?? 'Button';
    $url = $data['url'] ?? '#';
    $variant = $data['variant'] ?? 'primary';
    $bgColor = $data['bgColor'] ?? '#007bff';

    // Styles selon la variante
    $styles = [
        'primary' => "background: $bgColor; color: white; border: none;",
        'secondary' => "background: #6c757d; color: white; border: none;",
        'outline' => "background: transparent; color: $bgColor; border: 2px solid $bgColor;"
    ];

    $style = $styles[$variant] ?? $styles['primary'];

    ?>
    <div style="padding: 2rem;">
        <a href="<?= e($url) ?>"
           style="
               <?= $style ?>
               padding: 0.75rem 2rem;
               font-size: 1rem;
               font-weight: 600;
               text-decoration: none;
               border-radius: 4px;
               display: inline-block;
               transition: opacity 0.2s;
           "
           onmouseover="this.style.opacity='0.8'"
           onmouseout="this.style.opacity='1'">
            <?= e($text) ?>
        </a>
    </div>
    <?php
}

function renderFeatures($data) {
    $title = $data['title'] ?? '';
    $columns = intval($data['columns'] ?? 3);

    // Limiter le nombre de colonnes
    $columns = max(2, min(4, $columns));

    ?>
    <div class="features" style="padding: 3rem 2rem; background: #f8f9fa;">
        <?php if ($title): ?>
            <h2 style="text-align: center; margin: 0 0 3rem 0; font-size: 2.5rem;">
                <?= e($title) ?>
            </h2>
        <?php endif; ?>

        <div style="
            display: grid;
            grid-template-columns: repeat(<?= $columns ?>, 1fr);
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        ">
            <?php for ($i = 1; $i <= $columns; $i++): ?>
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin: 0 0 1rem 0;">Fonctionnalité <?= $i ?></h3>
                    <p style="margin: 0; color: #666;">
                        Description de la fonctionnalité numéro <?= $i ?>.
                    </p>
                </div>
            <?php endfor; ?>
        </div>
    </div>
    <?php
}

function renderTestimonial($data) {
    $author = $data['author'] ?? 'Anonyme';
    $quote = $data['quote'] ?? '';
    $photo = $data['photo'] ?? '';
    $rating = intval($data['rating'] ?? 5);

    // Limiter la note entre 1 et 5
    $rating = max(1, min(5, $rating));

    ?>
    <div class="testimonial" style="
        padding: 3rem 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    ">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
            <?php if ($photo): ?>
                <img src="<?= e($photo) ?>"
                     alt="<?= e($author) ?>"
                     style="
                         width: 80px;
                         height: 80px;
                         border-radius: 50%;
                         margin: 0 auto 1.5rem;
                         display: block;
                         border: 3px solid white;
                     ">
            <?php endif; ?>

            <?php if ($quote): ?>
                <blockquote style="
                    font-size: 1.5rem;
                    font-style: italic;
                    margin: 0 0 1.5rem 0;
                    line-height: 1.6;
                ">
                    <?= $quote ?>
                </blockquote>
            <?php endif; ?>

            <div style="margin-bottom: 0.5rem;">
                <?php for ($i = 0; $i < 5; $i++): ?>
                    <span style="font-size: 1.5rem; color: <?= $i < $rating ? '#ffc107' : 'rgba(255,255,255,0.3)' ?>;">
                        ★
                    </span>
                <?php endfor; ?>
            </div>

            <cite style="font-weight: bold; font-size: 1.125rem; font-style: normal;">
                — <?= e($author) ?>
            </cite>
        </div>
    </div>
    <?php
}
