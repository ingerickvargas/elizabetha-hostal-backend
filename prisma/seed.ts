import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Copia aquí tus ROOMS tal como están (o importarlas del frontend si luego lo organizamos)
const ROOMS = [
  {
    id: '1',
    name: 'The Coffee Loft',
    name_es: 'El Loft Cafetero',
    price: 85,
    description: 'Private balcony with views of the valley and a queen size premium bed.',
    description_es: 'Balcón privado con vistas al valle y cama queen premium.',
    longDescription:
      'Perched at the highest point of our historic colonial building, The Coffee Loft offers unparalleled views of the Salento valley. This room features original 100-year-old wooden beams, a private balcony perfect for morning meditation, and a hand-crafted workspace for digital nomads.',
    longDescription_es:
      'Ubicado en el punto más alto de nuestro edificio colonial histórico, El Loft Cafetero ofrece vistas inigualables del valle de Salento. Esta habitación cuenta con vigas de madera originales de 100 años, un balcón privado perfecto para la meditación matutina y un espacio de trabajo artesanal para nómadas digitales.',
    image:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200'
    ],
    tag: 'From $85/night',
    tag_es: 'Desde $85/noche',
    size: '28m²',
    size_es: '28m²',
    bathroom: 'Private',
    bathroom_es: 'Privado',
    amenity: 'Fast WiFi',
    amenity_es: 'WiFi Rápido',
    features: [
      { icon: 'balcony', name: 'Private Balcony', name_es: 'Balcón Privado' },
      { icon: 'coffee_maker', name: 'Espresso Bar', name_es: 'Barra de Espresso' },
      { icon: 'bed', name: 'King Bed', name_es: 'Cama King' }
    ],
    capacity: 2,
    isActive: true
  },
  {
    id: '2',
    name: 'Andean Suite',
    name_es: 'Suite Andina',
    price: 120,
    description: 'Spacious master suite featuring a luxury soaking tub and local art decor.',
    description_es: 'Amplia suite principal con bañera de lujo y decoración de arte local.',
    longDescription:
      'Our signature suite is a celebration of Quindío culture. Featuring high ceilings and floor-to-ceiling windows that frame the Andean peaks, the Andean Suite includes a hand-carved stone soaking tub, luxury linens, and curated local art. Ideal for couples seeking a romantic getaway.',
    longDescription_es:
      'Nuestra suite exclusiva es una celebración de la cultura del Quindío. Con techos altos y ventanales que enmarcan los picos andinos, la Suite Andina incluye una bañera de piedra tallada a mano, lencería de lujo y arte local curado. Ideal para parejas que buscan una escapada romántica.',
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1200'
    ],
    tag: 'From $120/night',
    tag_es: 'Desde $120/noche',
    size: '42m²',
    size_es: '42m²',
    bathroom: 'Tub',
    bathroom_es: 'Bañera',
    amenity: 'Mini Bar',
    amenity_es: 'Mini Bar',
    features: [
      { icon: 'bathtub', name: 'Soaking Tub', name_es: 'Bañera de Inmersión' },
      { icon: 'mountain_flag', name: 'Valley View', name_es: 'Vista al Valle' },
      { icon: 'wine_bar', name: 'Premium Bar', name_es: 'Bar Premium' }
    ],
    capacity: 3,
    isActive: true
  },
  {
    id: '3',
    name: 'Cacao Double',
    name_es: 'Doble Cacao',
    price: 55,
    description: 'Cozy and functional, perfect for couples looking for an authentic stay.',
    description_es: 'Acogedora y funcional, perfecta para parejas que buscan una estancia auténtica.',
    longDescription:
      'Inspired by the rich chocolate traditions of the region, the Cacao Double is a warm, earth-toned retreat. Quiet and peaceful, it faces our inner colonial courtyard, offering a cool respite from the midday sun. It is equipped with modern essentials without losing its rustic charm.',
    longDescription_es:
      'Inspirada en las ricas tradiciones chocolateras de la región, la Doble Cacao es un refugio cálido en tonos tierra. Tranquila y pacífica, da a nuestro patio colonial interior, ofreciendo un respiro fresco del sol del mediodía. Está equipada con lo esencial moderno sin perder su encanto rústico.',
    image:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1591088398332-8a77d397ef84?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=1200'
    ],
    tag: 'From $55/night',
    tag_es: 'Desde $55/noche',
    size: '22m²',
    size_es: '22m²',
    bathroom: 'Double',
    bathroom_es: 'Doble',
    amenity: 'Smart TV',
    amenity_es: 'Smart TV',
    features: [
      { icon: 'laptop_mac', name: 'Workspace', name_es: 'Zona de Trabajo' },
      { icon: 'tv', name: 'Smart TV', name_es: 'Smart TV' },
      { icon: 'energy_savings_leaf', name: 'Eco-Friendly', name_es: 'Ecológico' }
    ],
    capacity: 2,
    isActive: true
  }
] as const

const prisma = new PrismaClient()

async function main() {
  // 1) Admin único
  const email = process.env.ADMIN_EMAIL || 'admin@elizabetha.local'
  const password = process.env.ADMIN_PASSWORD || 'Admin123*'

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash }
  })

  // 2) Rooms (upsert por id)
  for (const room of ROOMS) {
	await prisma.room.upsert({
		where: { id: room.id },
    update: {
      name: room.name,
      name_es: room.name_es,
      price: room.price,
      description: room.description,
      description_es: room.description_es,
      longDescription: room.longDescription,
      longDescription_es: room.longDescription_es,
      image: room.image,
      galleryImages: [...room.galleryImages],
      tag: room.tag,
      tag_es: room.tag_es,
      size: room.size,
      size_es: room.size_es,
      bathroom: room.bathroom,
      bathroom_es: room.bathroom_es,
      amenity: room.amenity,
      amenity_es: room.amenity_es,
      capacity: room.capacity,
      features: room.features as any,
      isActive: true
    },
    create: {
      id: room.id,
      name: room.name,
      name_es: room.name_es,
      price: room.price,
      description: room.description,
      description_es: room.description_es,
      longDescription: room.longDescription,
      longDescription_es: room.longDescription_es,
      image: room.image,
      galleryImages: [...room.galleryImages],
      tag: room.tag,
      tag_es: room.tag_es,
      size: room.size,
      size_es: room.size_es,
      bathroom: room.bathroom,
      bathroom_es: room.bathroom_es,
      amenity: room.amenity,
      amenity_es: room.amenity_es,
      capacity: room.capacity,
      features: room.features as any,
      isActive: true
    }
	})
  }

  console.log('✅ Seed completado: admin + rooms')
  console.log(`Admin: ${email}`)
  console.log(`Password: ${password}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
