DROP TABLE IF EXISTS digital_assets;

DROP TYPE IF EXISTS content_type;
DROP TYPE IF EXISTS content_categ;
DROP TYPE IF EXISTS license_type;

CREATE TYPE content_type AS ENUM ('fundaluri', 'tonuri de apel');
CREATE TYPE content_categ AS ENUM ('calculator', 'telefon');
CREATE TYPE license_type AS ENUM ('uz liber', 'uz personal', 'comercial');

CREATE TABLE IF NOT EXISTS digital_assets (
	id_asset serial PRIMARY KEY,
	title VARCHAR(90) NOT NULL,
	username VARCHAR(50),
	description TEXT,
	thumbnail VARCHAR(300) UNIQUE NOT NULL,
	audio_file VARCHAR(300),
	cont_type content_type DEFAULT 'fundaluri',
	cont_categ content_categ DEFAULT 'calculator',
	price NUMERIC(6, 2) NOT NULL CHECK (price >= 0),
	file_size NUMERIC(8, 2) NOT NULL CHECK (file_size > 0),
	upload_date TIMESTAMP DEFAULT current_timestamp,
	lic_type license_type DEFAULT 'uz personal',
	tags VARCHAR [],
	available BOOLEAN NOT NULL DEFAULT TRUE,

	CONSTRAINT check_if_ringtone CHECK (
		(cont_type = 'tonuri de apel' AND audio_file IS NOT NULL) OR 
		(cont_type != 'tonuri de apel')
	),
	
	CONSTRAINT check_categ_if_ringtone CHECK (
		(cont_type = 'tonuri de apel' AND cont_categ = 'telefon') OR 
		(cont_type != 'tonuri de apel')
	)
);

INSERT INTO digital_assets(title, username, description, thumbnail, audio_file, cont_type, cont_categ, price, file_size, upload_date, lic_type, tags, available) VALUES
('Aterizare Qatar Airways', 'merlin32', 'Boeing 787 al Qatar Airways vazut de jos.', 'QatarAirwaysLanding.jpg', NULL, 'fundaluri', 'telefon', 10.00, 311, '2026-05-01', 'uz personal', ARRAY['aviation', 'sky', 'Boeing'], true),
('Turkish Airlines A330', 'merlin32', 'Airbus A330 al Turkish Airlines in lumina spectaculoasa a soarelui de aprilie.', 'TurkishAirlinesUnderbelly.jpg', NULL, 'fundaluri', 'telefon', 12.00, 956, '2026-04-23', 'uz personal', ARRAY['aviation', 'airbus', 'sky', 'undebelly'], true),
('Romanian Geisha', 'merlin32', 'O prezenta mistica si plina de gratie, surprinsa intr-o ipostaza dramatica.', 'RomanianGeisha.jpg', NULL, 'fundaluri', 'telefon', 20.00, 270, '2025-09-12', 'comercial', '{}', true),
('Aparitie pe timp de furtuna', 'johnPhotography', NULL, 'StormyAppearance.jpg', NULL, 'fundaluri', 'calculator', 21.00, 5.73, '2026-03-12', 'uz personal', ARRAY['stormy', 'car', 'landing', 'planes', 'underground'], true),
('Space Trap Beat', 'bestBeatsOnly', 'Ton de apel spatial din zona trap 140bpm', '140bpmThumbnail.jpg', '140bpmRootNoteF6SpaceTrapBeat.mp3', 'tonuri de apel', 'telefon', 0.00, 7.61, '2026-01-01', 'uz liber', ARRAY['trapbeat', 'space'], true),
('Galaxy Beat', 'bestBeatsOnly', 'Simte-te purtat intr-o alta galaxie cu acest ton de apel', 'galaxyTypeBeat.jpg', 'GalaxyTypeBeat.mp3', 'tonuri de apel', 'telefon', 4.00, 5.33, '2025-12-29', 'uz personal', '{}', false),
('Ton de apel Phonk', 'mariusManoleOfficial', 'Ton de apel in stil phonk pentru cei pasionati de gen', 'phonkThumbnail.jpg', 'driftPhonkBeat.mp3', 'tonuri de apel', 'telefon', 0.00, 4.88, '2025-12-29', 'uz liber', ARRAY['phonk', 'memphis', 'underground'], false),
('Ton de apel misterios', 'aztecaBeats', 'Ton de apel din zona trap, inspirat dupa instrumentalele artistului roman Azteca', 'aztecaTypeBeat.jpg', 'aztecaTypeBeat.mp3', 'tonuri de apel', 'telefon', 5.00, 2.81, '2025-11-11', 'uz personal', ARRAY['dark', 'trapbeat', 'underground'], true),
('Avion aterizand la apus', 'merlin32', 'Impunatorul Airbus A350 aterizand pe timp de apus la Bucuresti','AirbusA350_TurkishAirlines.jpg', NULL, 'fundaluri', 'calculator', 30.00, 4.81, '2026-05-02', 'comercial', ARRAY['aviation', 'sunset', 'airbus', 'turkishairlines'], false),
('Furia rosie', 'johnPhotography', 'Furia rosie pregatita de drum', 'FuriaRoja.jpg', NULL, 'fundaluri', 'calculator', 10.00, 2.87, '2026-05-01', 'uz personal', ARRAY['furia', 'roja', 'golf7'], true),
('Centrul orasului Sighisoara', 'johnPhotography', 'Un tur in trecut in centrul orasului Sighisoara', 'SighisoaraCenter3.jpg', NULL, 'fundaluri', 'telefon', 0.00, 4.63, '2026-04-27', 'comercial', ARRAY['vechi', 'centru', 'vintage'], true),
('Golf 7 Modul Sport', 'johnPhotography', 'Unghiul perfect pentru aceasta masina', 'Golf7Rim.jpg', NULL, 'fundaluri', 'calculator', 0.00, 0.88, '2026-04-12','uz liber', '{}', false),
('Catedrala din Pisa', 'merlin32', NULL, 'CatedralaDinPisa.jpg', NULL, 'fundaluri', 'calculator', 24.00, 1.70, '2025-08-14', 'uz personal', ARRAY['cinematic', 'artistic', 'arhitecture', 'trip'], true),
('Apusul asupra Pisei', 'merlin32', NULL, 'ApusPisa.jpg', NULL, 'fundaluri', 'calculator', 0.00, 1.98, '2025-09-23', 'uz liber', '{}', true),
('Monti Pisani', 'merlin32', NULL, 'MontiPisani.jpg', NULL, 'fundaluri', 'calculator', 0.00, 5.35, '2025-09-23', 'uz liber', '{}', true),
('Motociclistul singuratic', 'merlin32', NULL, 'LoneRider.jpg', NULL, 'fundaluri', 'calculator', 40.00, 2.97, '2026-03-01', 'uz personal', ARRAY['dark', 'rider', 'lone'], true);


